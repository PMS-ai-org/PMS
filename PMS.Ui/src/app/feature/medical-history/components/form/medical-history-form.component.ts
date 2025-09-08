import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicalHistory } from '../../../../models/medical-history.model';
import { MedicalHistoryService } from '../../../../services/medical-history.service';

@Component({
  selector: 'pms-medical-history-form',
  templateUrl: './medical-history-form.component.html',
  styleUrls: ['./medical-history-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule]
})
export class MedicalHistoryFormComponent implements OnInit {
  record: MedicalHistory = {
    id: '',
    patientId: '',
    code: '',
    description: '',
    source: '',
    clinicId: '',
    siteId: ''
  };
  isEdit = false;
  form: FormGroup;
  loading = false;
  patientId?: string;

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
    this.patientId = this.route.snapshot.paramMap.get('patientId') ?? '';

    if (id) {
      // Edit mode
      this.isEdit = true;
      this.service.getById(id).subscribe(data => {
        this.record = data;
        this.patientId = data.patientId;
        this.form.patchValue(this.record);
      });
    } else {
      // Add mode
      this.isEdit = false;
      this.record = { patientId: this.patientId } as MedicalHistory;
      this.form.patchValue({ patientId: this.patientId });
    }
  }

  onSubmit(): void {
    this.loading = true;

    const record = this.form.value;
    record.patientId = this.record?.patientId;

    if (this.isEdit && this.record?.id) {
      this.service.update(this.record.id, record).subscribe({
        next: () => {
          this.loading = false;
          this.snack.open('Medical history updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/medical-history', record.patientId]);
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
          this.router.navigate(['/medical-history', record.patientId]);
        },
        error: err => {
          this.loading = false;
          this.snack.open(err?.error?.message || 'Creation failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}