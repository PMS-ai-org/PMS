import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/shared/material.module';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule, CommonModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() patientId = '';
  appointments: Appointment[] = [];
  editingId?: string = undefined;
  error: string | null = null;
appointmentForm : FormGroup;



constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
  this.appointmentForm = this.fb.group({
    scheduledAt: ['', Validators.required],
    status: ['scheduled'],
    treatmentPlan: ['']
  });
}

  ngOnInit(): void {
    if (this.patientId) {
      this.loadAppointments();
    }
  }

  loadAppointments() {
    this.appointmentService.getByPatient(this.patientId).subscribe({
      next: res => this.appointments = res,
      error: err => this.error = err.message
    });
  }

  onSubmit() {
    const formValue = this.appointmentForm.value;
    const appt: Appointment = {
      id: this.editingId,
      patientId: this.patientId,
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

  edit(appt: Appointment) {
    this.editingId = appt.id;
    this.appointmentForm.patchValue({
      scheduledAt: appt.scheduledAt,
      status: appt.status,
      treatmentPlan: appt.treatmentPlan
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