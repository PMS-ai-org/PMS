import { AfterViewInit, Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap, of, Subscription, BehaviorSubject, tap } from 'rxjs';
import { MaterialModule } from '../../../core/shared/material.module';
import { SearchPatientResponse, SearchPatientResult, SearchPatientService } from '../../../services/search-patient.service';
import { HighlightPipe } from './highlight.pipe';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// Removed MatSort imports (sorting disabled)
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
import { Features, Site } from '../../../core/models/user.models';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
  MatTooltipModule,
  HighlightPipe,
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

  searchControl = new FormControl('', [Validators.minLength(1)]);
  patients = signal<Patient[]>([]);
  displayedColumns: string[] = ['full_name', 'dob', 'gender', 'email', 'phone', 'action'];
  dataSource = new MatTableDataSource<Patient>([]);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Pagination state */
  totalCount = 0;               // server provided total
  pageIndex = 0;                // zero based for mat-paginator
  tablePageSize = 10;           // default page size (can be changed by user)

  features: Features[] = [];
  currentRole: string = '';
  role = "";
  showprofile = false;
  showappointment = false;
  showmedicalhistory = false;
  showregister = false;
  showtreatmentPlan = false;
  canEditProfile = false;
  canDeleteProfile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private svc: SearchPatientService, private dialog: MatDialog, private router: Router,
    private patientService: PatientService, private repo: RepositoryService, private authSession: AuthSessionService, private toastService: ToastService) {
    effect(() => {
      const siteData = this.authSession.siteData();
      this.getFeaturesListForSite(siteData);
    })
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

  /** Trigger a new search resetting to first page */
  onSearch() {
    this.pageIndex = 0;
    this.loadPage();
  }

  /** Paginator change */
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.tablePageSize = event.pageSize;
    this.loadPage();
  }


  /** Core loader contacting API (currently API lacks sorting params, extend when backend ready) */
  private loadPage() {
    const query = this.searchControl.value?.trim() || '';
    if (!query) {
      this.dataSource.data = [];
      this.totalCount = 0;
      return;
    }
    this.isLoading.next(true);
    this.patientService
      .search(query, this.pageIndex + 1, this.tablePageSize)
      .pipe(
        tap(() => this.isLoading.next(false))
      )
      .subscribe({
        next: (response) => {
            this.dataSource.data = response.results;
            this.totalCount = response.totalCount;
        },
        error: () => {
          this.dataSource.data = [];
          this.totalCount = 0;
        }
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

  navigateToProfilePage(patientId: string) {
    this.router.navigate(['/patient/profile', patientId]);
  }

  deletePatient(patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete ${patient.full_name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (patient.id) {
          this.repo.deletePatient(patient.id).subscribe({
            next: () => {
              // Update current page after deletion
              this.toastService.success(`Successfully deleted patient ${patient.full_name}`);
              // If last item on page removed & not first page, go back a page
              if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
                this.pageIndex -= 1;
              }
              this.loadPage();
            },
            error: () => {
              this.toastService.error(`Error deleting patient ${patient.full_name}`);
            }
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getFeaturesListForSite(site: Site | null) {
    
    if (site) {
      this.features = site.features ?? [];
    } else {
      this.features = [];
    }

    if (this.role === 'Admin') {
      this.showappointment = true;
      this.showprofile = true;
      this.showmedicalhistory = true;
      this.showregister = true;
    }
    else {
      this.showprofile = this.features.some(f => f.featureName === 'Profile' && (f.canAdd || f.canEdit || f.canView || f.canDelete));
      this.showappointment = this.features.some(f => f.featureName === 'Appointment' && (f.canAdd || f.canEdit || f.canView || f.canDelete));
      this.showmedicalhistory = this.features.some(f => f.featureName === 'MedicalHistory' && (f.canAdd || f.canEdit || f.canView || f.canDelete));
      this.showregister = this.features.some(f => f.featureName === 'Register' && (f.canAdd || f.canEdit || f.canView || f.canDelete));
      this.showtreatmentPlan = this.features.some(f => f.featureName === 'TreatmentPlan' && (f.canAdd || f.canEdit || f.canView || f.canDelete));

      this.canEditProfile = this.features.some(f => f.featureName === 'Profile' && f.canEdit);
      this.canDeleteProfile = this.features.some(f => f.featureName === 'Profile' && f.canDelete);

    }
  }

  appointmentNavigation() {
    this.router.navigate(
      ['/appointment']
    );
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
