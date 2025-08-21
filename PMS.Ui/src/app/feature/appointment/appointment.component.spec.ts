import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentComponent } from './appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentComponent, ReactiveFormsModule, CommonModule],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getByPatient: () => of([]),
            create: () => of({}),
            update: () => of({}),
            delete: () => of({})
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

  it('should handle edit', () => {
    const appt = { id: '1', patientId: '123', bookedAt: '', scheduledAt: '2025-08-20T12:00', status: 'scheduled', treatmentPlan: 'Routine' };
    component.edit(appt);
    expect(component.editingId).toBe('1');
    expect(component.appointmentForm.value.scheduledAt).toBe('2025-08-20T12:00');
  });
});