import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, Observable, startWith, of } from 'rxjs';
import { PatientService, Patient } from '../../services/patient.service';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../core/shared/material.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-patient-autocomplete',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './patient-autocomplete.component.html',
  styleUrls: ['./patient-autocomplete.component.scss']
})
export class PatientAutocompleteComponent {
  searchCtrl = new FormControl('');
  filteredPatients$: Observable<Patient[]> = of([]);
  showGrid = false;
  results: Patient[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  @Output() patientSelected = new EventEmitter<Patient>();

  displayedColumns: string[] = ['fullName', 'dob', 'gender', 'phone', 'email'];

  constructor(private patientService: PatientService) {
    this.filteredPatients$ = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (!value || value.length < 2) {
          this.showGrid = false;
          return of([]);
        }
        // For autocomplete dropdown, just fetch first 5 results (do not care about totalCount)
        return this.patientService.search(value, 1, 5).pipe(
          switchMap(res => of(res.results))
        );
      })
    );
  }

  onOptionSelected(patient: Patient) {
    this.patientSelected.emit(patient);
    this.showGrid = false;
  }

  onSearchClick() {
    const value = this.searchCtrl.value;
    if (value && value.length >= 2) {
      this.patientService.search(value, this.pageIndex + 1, this.pageSize).subscribe(res => {
        this.results = res.results;
        this.totalCount = res.totalCount;
        this.showGrid = true;
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSearchClick();
  }

  onRowClick(patient: Patient) {
    this.patientSelected.emit(patient);
  }
}