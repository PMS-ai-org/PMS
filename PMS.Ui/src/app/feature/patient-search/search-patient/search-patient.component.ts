import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap, of, Subscription } from 'rxjs';
import { MaterialModule } from '../../../core/shared/material.module';
import { SearchPatientResponse, SearchPatientResult, SearchPatientService } from '../../../services/search-patient.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Patient } from '../../../models/patient.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirmationDialog.component';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RepositoryService } from '../../../services/repository.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.scss']
})
export class SearchPatientComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() placeholder = 'Search patients';
  @Input() pageSize = 20;
  @Input() debounceMs = 250;
  @Input() minLength = 2;

  /** Emit the full paged response so parent can bind items/total as needed */
  @Output() resultsChange = new EventEmitter<SearchPatientResponse>();
  /** Emit a single selected patient (an item from the response) */
  @Output() patientSelected = new EventEmitter<SearchPatientResult>();

  /** Optional external control */
  @Input() control?: FormControl<string>;

  q!: FormControl<string>;
  loading = false;

  /** Options shown in autocomplete are individual items */
  options: SearchPatientResult[] = [];
  private sub?: Subscription;

  searchControl = new FormControl('', [Validators.minLength(3)]);
  patients = signal<Patient[]>([]);
  displayedColumns: string[] = ['full_name', 'dob', 'gender', 'email', 'phone', 'action'];
  dataSource = new MatTableDataSource<Patient>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private svc: SearchPatientService, private dialog: MatDialog, private router: Router, private patientService: PatientService, private repo: RepositoryService) {

  }

  ngOnInit(): void {
    this.q = this.control ?? new FormControl<string>('', { nonNullable: true });

    this.sub = this.q.valueChanges.pipe(
      startWith(this.q.value),
      debounceTime(this.debounceMs),
      distinctUntilChanged(),
      switchMap(text => {
        const term = (text || '').trim();
        if (!term || term.length < this.minLength) {
          this.loading = false;
          this.options = [];
          this.resultsChange.emit({ total: 0, items: [] });
          return of({ total: 0, items: [] } as SearchPatientResponse);
        }
        this.loading = true;
        return this.svc.searchPatients(term, this.pageSize);
      })
    ).subscribe({
      next: (res) => {
        this.options = res.items;
        this.resultsChange.emit(res);
        this.loading = false;
      },
      error: () => {
        this.options = [];
        this.resultsChange.emit({ total: 0, items: [] });
        this.loading = false;
      }
    });
  }

  /** Autocomplete display uses the item’s fullName (adjust if your field differs) */
  displayFn = (p?: SearchPatientResult | null) => (p ? p.fullName : '');

  onOptionSelected(p: SearchPatientResult) {
    this.q.setValue(p.fullName, { emitEvent: false });
    this.patientSelected.emit(p);
  }

  clear() {
    this.q.setValue('');
    this.options = [];
    this.resultsChange.emit({ total: 0, items: [] });
  }

  clearSearchField() {
    this.searchControl.setValue('');
    this.dataSource.data = [];
  }

  onSearch() {
    const query = this.searchControl.value || '';
    this.patientService.search(query).subscribe(response => {
      this.dataSource.data = response.results;
    }, () => {
      console.error('Search error');
    });
  }

  onPageChange(event: PageEvent) {
    const query = this.searchControl.value || '';
    this.patientService.search(query, event.pageIndex + 1, event.pageSize).subscribe(response => {
      this.dataSource.data = response.results;
      this.paginator.length = response.totalCount; // API should return total count
    });
  }

  onEdit(patientId: string) {
    this.router.navigate(['/patient/register', patientId]);
  }

  onMedicalHistory(patient: Patient) {
    this.router.navigate(
      ['/medical-history', patient.id],
      { queryParams: { patientName: patient.full_name } }
    );
  }

  createNewPatient() {
    this.router.navigate(['/patient/register']);
  }

  deletePatient(patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete ${patient.full_name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if(patient.id) {
          this.repo.deletePatient(patient.id).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(p => p.id !== patient.id);
              this.paginator.length = this.dataSource.data.length;
            },
            error: () => {
              console.error(`❌ Error deleting patient ${patient.id}:`);
            }
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
