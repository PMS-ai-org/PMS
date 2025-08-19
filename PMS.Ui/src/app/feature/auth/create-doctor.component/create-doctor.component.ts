import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../core/shared/material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/auth/clinic.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'pms-create-doctor',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.scss'
})
export class CreateDoctorComponent implements OnInit {

  constructor(private fb: FormBuilder, private clinicService: ClinicService) { }

  doctorForm!: FormGroup;
  clinics: any[] = [];
  sites: any[] = [];

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      roleId: ['', Validators.required],
      clinicId: ['', Validators.required],
      siteId: ['', Validators.required],
      access: this.fb.group({}) // can later bind to checkboxes for permissions
    });

    this.loadClinics();
  }

  loadClinics() {
    this.clinicService.getClinics().subscribe(data => {
      this.clinics = data;
    });
  }

  onClinicChange(clinicId: string) {
    this.clinicService.getSitesByClinic(clinicId).subscribe(data => {
      this.sites = data;
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      const formValue = this.doctorForm.value;

      const payload = {
        username: formValue.username,
        email: formValue.email,
        fullName: formValue.fullName,
        phoneNumber: formValue.phoneNumber,
        specialization: formValue.specialization,
        roleId: formValue.roleId,
        clinicSites: [
          {
            clinicId: formValue.clinicId,
            siteId: formValue.siteId
          }
        ],
        access: {} // build from UI permissions
      };

      this.clinicService.saveDoctor(payload).subscribe({
        next: () => alert('Doctor registered successfully!'),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}
