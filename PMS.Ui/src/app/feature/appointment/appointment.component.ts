import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { RepositoryService } from '../../services/repository.service';
import { UserDetail } from '../../models/user-detail.model';
import { Clinic } from '../../models/clinic.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/shared/material.module';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { PatientAutocompleteComponent } from '../patient-autocomplete/patient-autocomplete.component';
import { scheduled } from 'rxjs';
import { MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule, CommonModule, PatientAutocompleteComponent, MatDateRangePicker],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() patientId = '';
  appointments: Appointment[] = [
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      bookedAt: '2025-08-20T08:00:00Z',
      scheduledAt: '2025-08-21T09:00:00Z',
      status: 'scheduled',
      clinicId: 'c1',
      treatmentPlan: '',
      notes: 'Patient is not healthy.'
    },
    {
      id: '2',
      patientId: 'p1',
      patientName: 'John Doe',
      bookedAt: '2025-08-22T10:00:00Z',
      scheduledAt: '2025-08-23T11:00:00Z',
      status: 'Scheduled',
      clinicId: 'c1',
      treatmentPlan: '',
      notes: 'Regular check-up.'
    },
  ];
  doctors: UserDetail[] = [];
  departments: Clinic[] = [];
  editingId?: string = undefined;
  error: string | null = null;
appointmentForm : FormGroup;
appointmentDcotorForm : FormGroup;
userRole: string = '';



constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authSession: AuthSessionService,
    private repositoryService: RepositoryService
) {
  this.appointmentForm = this.fb.group({
    doctorId: ['', Validators.required],
    departmentId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    reason: [''],
    notes: [''],
    scheduledAt: ['', Validators.required]
  });

  this.appointmentDcotorForm = this.fb.group({
    status: ['scheduled', Validators.required],  
    treatmentPlan: ['']
  }); 
}

  ngOnInit(): void {
    this.userRole = this.authSession.session()?.role ?? '';
    // Load doctors with specialization related to medicine
    this.repositoryService.getUsers().subscribe({
      next: users => {
        this.doctors = users;
        console.log('Doctors loaded:', this.doctors);
      },
      error: err => this.error = err.message
    });
    // Load departments (clinics)
    this.repositoryService.getClinics().subscribe({
      next: clinics => {
        this.departments = clinics;
      },
      error: err => this.error = err.message
    });

    if (this.patientId) {
      this.loadAppointments();
    }
  }

  onPatientSelected(patient: any) {
    const patientId = patient?.id || patient;
    this.patientId = patientId;
    this.appointmentForm.patchValue({ patientId });
    this.loadAppointments();
  }

  loadAppointments() {
    this.repositoryService.getAppointments().subscribe({
      next: res => this.appointments = res,
      error: err => this.error = err.message
     
    });
     console.log('Appointments loaded:', this.appointments)
  }

  onSubmit() {
    const formValue = this.appointmentForm.value;
    const appt: Appointment = {
      id: this.editingId,
      patientId: this.patientId,
      clinicId: formValue.departmentId, // department mapped to clinic
      notes: `Doctor: ${formValue.doctorId}${formValue.notes ? ' | ' + formValue.notes : ''}`,
      scheduledAt: formValue.scheduledAt ?? '',
      status: formValue.status ?? '',
      treatmentPlan: formValue.treatmentPlan ?? '',
      bookedAt: new Date().toISOString()
    };
    if (this.editingId) {
      this.appointmentService.update(this.editingId, appt).subscribe({
        next: () => {
          this.editingId = undefined;
          this.appointmentForm.reset({ status: 'scheduled' });
          this.loadAppointments();
        },
        error: err => this.error = err.message
      });
    } else {
      this.appointmentService.create(appt).subscribe({
        next: () => {
          this.appointmentForm.reset({ status: 'scheduled' });
          this.loadAppointments();
        },
        error: err => this.error = err.message
      });
    }
  }


  // Doctor card actions
  editAppointment(appt: Appointment) {
    this.editingId = appt.id;
    this.appointmentDcotorForm.patchValue({
      status: appt.status || 'scheduled',
      treatmentPlan: appt.treatmentPlan || ''
    });
  }

  updateAppointment(appt: Appointment) {
    const formValue = this.appointmentDcotorForm.value;
    const updated: Appointment = {
      ...appt,
      status: formValue.status,
      treatmentPlan: formValue.treatmentPlan
    };
    this.appointmentService.update(appt.id!, updated).subscribe({
      next: () => {
        this.editingId = undefined;
        this.loadAppointments();
      },
      error: err => this.error = err.message
    });
  }

  cancelEdit() {
    this.editingId = undefined;
    this.appointmentDcotorForm.reset({ status: 'scheduled', treatmentPlan: '' });
  }

  deleteAppointment(appt: Appointment) {
    if (!appt.id) return;
    this.appointmentService.delete(appt.id).subscribe({
      next: () => this.loadAppointments(),
      error: err => this.error = err.message
    });
  }

  delete(id?: string) {
    if (!id) return;
    this.appointmentService.delete(id).subscribe({
      next: () => this.loadAppointments(),
      error: err => this.error = err.message
    });
  }
}