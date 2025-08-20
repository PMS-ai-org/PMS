import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientAutocompleteComponent } from './patient-autocomplete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PatientAutocompleteComponent', () => {
  let component: PatientAutocompleteComponent;
  let fixture: ComponentFixture<PatientAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientAutocompleteComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: PatientService,
          useValue: {
            search: () => of({ results: [{ id: '1', fullName: 'Jane Doe', phone: '123' }], totalCount: 1 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show results when search is triggered', () => {
    component.searchCtrl.setValue('Jane');
    component.onSearchClick();
    fixture.detectChanges();
    // Use Jest matcher instead of Jasmine's toBeTrue()
    expect(component.showGrid).toBe(true);
    expect(component.results.length).toBeGreaterThan(0);
  });
});