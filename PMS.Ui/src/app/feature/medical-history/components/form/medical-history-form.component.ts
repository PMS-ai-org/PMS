import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistory } from '../../models/medical-history.model';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pms-medical-history-form',
  templateUrl: './medical-history-form.component.html',
  imports: [ 
    CommonModule, ReactiveFormsModule, RouterLink, MaterialModule
  ]
})
export class MedicalHistoryFormComponent implements OnInit {
  record: MedicalHistory = {
    id: '',
    patientId: '',
    code: '',
    description: '',
    source: '',
    clinicId: '',
    siteId: '',
    createdAt: new Date().toISOString(),
    created_by: '',
    updated_at: null,
    updated_by: ''
  };
  isEdit = false;
  form: FormGroup;
  loading = false;

  constructor(
    private service: MedicalHistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      source: [''],
      clinicId: [''],
      siteId: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById(id).subscribe(data => {
        console.log('API raw response:', data);
        this.record = data;
        console.log('Mapped record:', this.record);
        this.form.patchValue(this.record);
      });
    } else {
      this.isEdit = false;
      this.record = {} as MedicalHistory;
    }
  }


  onSubmit(): void {
    this.loading = true;

    const record = this.form.value;
    record.patientId = this.record?.patientId || "e0d43bc2-7bb1-5b69-8a8a-fcacc203f4aa"; // ✅ fallback mock

    if (this.isEdit && this.record?.id) {
      this.service.update(this.record.id, record).subscribe({
        next: () => {
          this.loading = false;
          this.snack.open('Medical history updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/medicalHistoryList']);
        },
        error: err => {
          this.loading = false;
          this.snack.open(err?.error?.message || 'Update failed', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.service.create(record).subscribe({
        next: () => {
          this.loading = false;
          this.snack.open('Medical history created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/medicalHistoryList']);
        },
        error: err => {
          this.loading = false;
          this.snack.open(err?.error?.message || 'Creation failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

}
