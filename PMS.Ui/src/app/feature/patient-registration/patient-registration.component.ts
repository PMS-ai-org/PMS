import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../core/shared/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MaterialModule,
    MatTableModule
  ],
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss']
})
export class PatientRegistrationComponent implements OnInit {
  form: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  genders = ['Male', 'Female'];
  allergyOptions = ['Pollen', 'Dust', 'Peanuts', 'Seafood', 'Milk', 'Gluten'];
  conditions = ['Diabetes', 'Hypertension (High Blood Pressure)', 'Asthma', 'Heart Disease', 'Chronic Kidney Disease', 'Arthritis', 'Depression / Anxiety', 'Allergies', 'Thyroid Disorder', 'Cancer', 'COPD', 'Migraine', 'Obesity', 'Other'];
  medications = ['Aspirin', 'Metformin', 'Lisinopril', 'Simvastatin', 'Levothyroxine', 'Albuterol', 'Omeprazole', 'Amoxicillin', 'Ibuprofen', 'Acetaminophen', 'Other'];
  calculatedAge = 0;
  patientId: string | null = '';
  patientData!: Patient;

  constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router, private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: [''],
      age: [''],
      gender: ['',],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      address: ['',],
      bloodGroup: [''],
      allergies: [[]],
      conditions: [[]],
      medications: [[]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');

    if (this.patientId) {
      this.patientService.loadPatientById(this.patientId);
      this.patientService.patients$.subscribe(patient => {
        if (patient) {
          this.patientData = patient;
          this.loadPatientDetails(patient)
        }
      })
    }
  }

  loadPatientDetails(patient: Patient) {
    const [firstName, ...rest] = patient.full_name?.split(' ') || ['', ''];
    const lastName = rest.join(' ');
    this.form.patchValue({
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      age: patient.age,
      conditions: patient.conditions,
      medications: patient.medications,
      notes: patient.notes
    });
    this.calculatedAge = patient.age || 0;
  }

  calculateAge() {
    const dob = this.form.get('dateOfBirth')?.value;
    if (!dob) {
      this.calculatedAge = 0;
      return 0;
    };

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    this.calculatedAge = age;
  }


  onCancel() {
    this.form.reset();
  }

  onSubmit() {
    if (this.form.valid) {
      const data: Patient = this.mapPatientRecord(this.form)
      this.patientService.savePatient(data, this.patientId);
    } else {
      this.form.markAllAsTouched();
    }
  }

  mapPatientRecord(data: FormGroup): Patient {
    const patientData: Patient = {
      full_name: `${data.value.firstName} ${data.value.lastName}`.trim(),
      dob: data.value.dateOfBirth ? data.value.dateOfBirth : undefined,
      gender: data.value.gender,
      phone: data.value.phone,
      email: data.value.email,
      address: data.value.address,
      age: this.calculatedAge,
      conditions: data.value.conditions ?? null,
      medications: data.value.medications ?? null,
      notes: data.value.notes ?? null
    };
    if (this.patientId) {
      patientData.id = this.patientId;
      patientData.created_at = this.patientData?.created_at;
      patientData.updated_at = new Date();
    }
    return patientData;
  }
}