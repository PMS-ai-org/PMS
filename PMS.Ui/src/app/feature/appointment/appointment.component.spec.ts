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
            getClinics: () => of({})
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

  it('should load appointments', () => {
    component.loadAppointments();
    expect(component.appointments).toEqual([]);
  });

  it('should handle form submission for create', () => {
    component.editingId = undefined;
    component.appointmentForm.setValue({
      scheduledAt: '2025-08-20T12:00',
      status: 'scheduled',
      treatmentPlan: 'Routine'
    });
    component.onSubmit();
    expect(component.appointmentForm.value.status).toBe('scheduled');
  });
});