import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-registration.component.html'
})
export class PatientRegistrationComponent {
  registrationForm: any; // Or better: FormGroup
  success?: boolean;
  error?: string;

  constructor(private fb: FormBuilder, private patientService: PatientService) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      age: [''],
      conditions: [[]],
      medications: [[]]
    });
  }

  onSubmit() {
    const formValue = this.registrationForm.value;
    const patient: Patient = {
      fullName: formValue.fullName ?? '',
      dob: formValue.dob ?? '',
      gender: formValue.gender ?? '',
      phone: formValue.phone ?? '',
      email: formValue.email ?? '',
      address: formValue.address ?? '',
      age: formValue.age ? Number(formValue.age) : undefined
    };
    this.patientService.create(patient).subscribe({
      next: () => {
        this.success = true;
        this.registrationForm.reset();
      },
      error: err => {
        this.error = err.message;
        this.success = false;
      }
    });
  }
}