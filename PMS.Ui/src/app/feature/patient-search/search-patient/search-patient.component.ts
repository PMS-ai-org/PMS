import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap, of, Subscription } from 'rxjs';
import { MaterialModule } from '../../../core/shared/material.module';
import { SearchPatientResponse, SearchPatientResult, SearchPatientService } from '../../../services/search-patient.service';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.scss']
})
export class SearchPatientComponent implements OnInit, OnDestroy {
[x: string]: any;
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

  constructor(private svc: SearchPatientService) {}

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

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
