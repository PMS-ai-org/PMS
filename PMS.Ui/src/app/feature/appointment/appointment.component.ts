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
import { scheduled, Subject, takeUntil } from 'rxjs';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, PatientAutocompleteComponent],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() patientId = '';
  // appointments: Appointment[] = [
  //   {
  //     id: '1',
  //     patientId: 'p1',
  //     patientName: 'Ricky Flores',
  //     bookedAt: '2025-08-20T08:00:00Z',
  //     scheduledAt: '2025-08-21T09:00:00Z',
  //     status: 'scheduled',
  //     clinic_id: 'c1',
  //     treatment_plan: '',
  //     notes: 'Patient is not healthy.'
  //   }
  // ];
  private destroy$ = new Subject<void>();
  patientName: string = '';
  appointments: Appointment[] = [];
  patappointments: Appointment[] = [];
  doctors: UserDetail[] = [];
  departments: Clinic[] = [];
  editingId?: string = undefined;
  error: string | null = null;
  appointmentForm: FormGroup;
  appointmentDcotorForm: FormGroup;
  userRole: string = '';
  today: Date = new Date();
  diagnosisOptions = [
    { label: 'Type 2 Diabetes', value: 'type2_diabetes' },
    { label: 'Type 1 Diabetes', value: 'type1_diabetes' },
    { label: 'Pre-diabetes', value: 'pre_diabetes' },
    { label: 'Gestational Diabetes', value: 'gestational_diabetes' },
    { label: 'Hypertension', value: 'hypertension' }
  ];

  lifestyleOptions = [
    'carb counting',
    'HbA1c every 3 months',
    'daily exercise',
    'calorie tracking'
  ];

  medicationOptions = [
    'metformin',
    'insulin',
    'sulfonylureas'
  ];

  appointmentForms: { [key: string]: FormGroup } = {};
  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authSession: AuthSessionService,
    private repositoryService: RepositoryService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      departmentId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: [''],
      notes: [''],
      scheduledAt: ['']
    });

    this.appointmentDcotorForm = this.fb.group({
      status: ['scheduled', Validators.required],
      diagnosis: [null, Validators.required],
      lifestyle: [[]], // multi-select
      medications: [[]], // multi-select
      follow_up_days: [30, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap?.subscribe(params => {
      const patientId = params.get('patientId') ?? '';

      if (patientId) {
        this.patientId = patientId;

        this.patientService.loadPatientById(this.patientId);
        this.patientService.patients$
          .pipe(takeUntil(this.destroy$))
          .subscribe(patient => {
            if (patient) {
              this.patientName = patient.full_name;
              this.loadAppointment(this.patientId);
            }
          });
      }
    });

    this.userRole = this.authSession.session()?.role ?? '';
    // Load doctors with specialization related to medicine
    this.repositoryService.getUsers().subscribe({
      next: users => {
        this.doctors = users;
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
  }

  onPatientSelected(patient: any) {
    const patientId = patient?.id || patient;
    this.patientId = patientId;
    this.appointmentForm.patchValue({ patientId });
    this.loadAppointment(patientId);
  }

  loadAppointmentOld(patientId: any) {
    this.appointmentService.getByPatient(patientId).subscribe({
      next: res => {

        this.appointments = res.map(app => (
          {
            ...app,
            patientName: this.patientName,
            //treatment_plan: app.treatment_plan ? JSON.parse(app.treatment_plan) : null
            treatment_plan: typeof app.treatment_plan === 'string'
              ? JSON.parse(app.treatment_plan)
              : app.treatment_plan
          }
        ));

        this.appointments.forEach(app => {
          if (app.id) {
            let treatmentPlanObj = null;
            try {
              treatmentPlanObj = app.treatment_plan ? JSON.parse(app.treatment_plan) : {};
            } catch (error) {
              console.error('Failed to parse treatment_plan for appointment', app.id, error);
              treatmentPlanObj = {};
            }

            this.appointmentForms[app.id] = this.fb.group({
              status: [app.status || ''],
              diagnosis: [treatmentPlanObj?.diagnosis || ''],
              lifestyle: [treatmentPlanObj?.lifestyle || []],
              medications: [treatmentPlanObj?.medications || []],
              follow_up_days: [treatmentPlanObj?.follow_up_days || 0]
            });
          }
        });
        this.cd.detectChanges();
      },
      error: err => {
        this.error = err.message;
      }
    });

  }

  loadAppointment(patientId: any) {
    this.appointmentService.getByPatient(patientId).subscribe({
      next: res => {

        this.appointments = res.map(app => {
          let parsedTreatmentPlan = null;

          if (typeof app.treatment_plan === 'string') {
            try {
              parsedTreatmentPlan = JSON.parse(app.treatment_plan);
            } catch (error) {
              parsedTreatmentPlan = null;
            }
          } else {
            parsedTreatmentPlan = app.treatment_plan;
          }

          return {
            ...app,
            patientName: this.patientName,
            treatment_plan: parsedTreatmentPlan
          };
        });

        this.appointments.forEach(app => {
          if (app.id) {
            const tp = app.treatment_plan as any || {};
            this.appointmentForms[app.id] = this.fb.group({
              status: [app.status || 'scheduled'],
              diagnosis: [tp.diagnosis || ''],
              lifestyle: [tp.lifestyle || []],
              medications: [tp.medications || []],
              follow_up_days: [tp.follow_up_days || 0]
            });
          }
        });
        this.cd.detectChanges();
      },
      error: err => {
        this.error = err.message;
        console.error('Error loading appointments:', err);
      }
    });
  }

  loadAppointments() {
    this.repositoryService.getAppointments().subscribe({
      next: res => this.appointments = res,
      error: err => this.error = err.message

    });
  }

  onSubmit() {
    const formValue = this.appointmentForm.value;
    const treatmentPlan = {
      diagnosis: formValue.diagnosis,
      lifestyle: formValue.lifestyle,
      medications: formValue.medications,
      follow_up_days: formValue.follow_up_days
    };
    const appt: Appointment = {
      id: this.editingId,
      patient_id: this.patientId,
      clinic_id: formValue.departmentId, // department mapped to clinic
      notes: `Doctor: ${formValue.doctorId}${formValue.notes ? ' | ' + formValue.notes : ''}`,
      scheduled_at: formValue.scheduledAt || new Date().toISOString(),
      status: formValue.status ?? '',
      treatment_plan: JSON.stringify(treatmentPlan),
      booked_at: new Date().toISOString()
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
      treatmentPlan: appt.treatment_plan || ''
    });
  }

  updateAppointment(appt: Appointment, formValue: any) {

    const treatmentPlan = {
      diagnosis: formValue.diagnosis,
      lifestyle: formValue.lifestyle,
      medications: formValue.medications,
      follow_up_days: formValue.follow_up_days
    };

    const updated: Appointment = {
      ...appt,
      status: formValue.status,
      treatment_plan: JSON.stringify(treatmentPlan)
    };
    this.appointmentService.update(appt.id!, updated).subscribe({
      next: () => {
        this.editingId = undefined;
        this.loadAppointment(this.patientId);
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