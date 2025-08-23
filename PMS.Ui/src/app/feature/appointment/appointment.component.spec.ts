import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentComponent } from './appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PatientAutocompleteComponent } from '../patient-autocomplete/patient-autocomplete.component';
import { RepositoryService } from '../../services/repository.service';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentComponent, ReactiveFormsModule, CommonModule, PatientAutocompleteComponent],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getByPatient: () => of([]),
            create: () => of({}),
            update: () => of({}),
            delete: () => of({})
          }
        },
        {
          provide: RepositoryService,
          useValue: {
            getUsers: () => of([]),
            getClinics: () => of({}),
            getAppointments: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    component.patientId = '123';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});