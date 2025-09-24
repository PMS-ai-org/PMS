import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicalHistory } from '../../../../models/medical-history.model';
import { MedicalHistoryService } from '../../../../services/medical-history.service';
import { ClinicService } from '../../../../core/auth/clinic.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'pms-medical-history-form',
  templateUrl: './medical-history-form.component.html',
  styleUrls: ['./medical-history-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule]
})
export class MedicalHistoryFormComponent implements OnInit {

  codesList = [
    "hypertension",
    "diabetes",
    "alcoholism",
    "handicap"
  ];

  isEdit = false;
  form: FormGroup;
  loading = false;
  patientId?: string;
  record?: MedicalHistory;
  clinicList: any[] = [];
  selectedClinicName = '';
  sites: any[] = [];

  constructor(
    private service: MedicalHistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private clinicService: ClinicService,
  ) {
    this.form = this.fb.group({
      patientId: ['', [Validators.required]],
      code: ['', Validators.required],
      description: ['', Validators.required],
      source: ['', Validators.required],
      clinicId: [''],
      siteId: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.patientId) {
        this.patientId = params.patientId;
        this.form.patchValue({ patientId: params.patientId });
      }

      if (params.clinicId) {
        this.form.patchValue({ clinicId: params.clinicId });
        this.loadMasterData(params.clinicId); // ✅ only call here
      } else {
        this.loadMasterData();
      }

      if (params.siteId) {
        this.form.patchValue({ siteId: params.siteId });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById(id).subscribe(data => {
        this.record = data;
        this.patientId = data.patientId;
        this.form.patchValue(this.record);
      });
    } else {
      this.isEdit = false;
      this.record = { patientId: this.patientId } as MedicalHistory;
      this.form.patchValue({ patientId: this.patientId });
    }
  }

  loadMasterData(clinicId?: string) {
    forkJoin({
      clinics: this.clinicService.getClinics(),
      sites: clinicId ? this.clinicService.getSitesByClinic(clinicId) : of([]) // return empty if no clinicId
    }).subscribe({
      next: ({ clinics, sites }) => {
        this.clinicList = clinics;

        if (clinicId) {
          // ✅ set selected clinic name
          const clinic = this.clinicList.find(c => c.id === clinicId);
          this.selectedClinicName = clinic ? clinic.name : '';

          // ✅ set sites, sorted by name
          this.sites = sites.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        }
      },
      error: (err) => {
        this.snack.open(
          'Failed to load data. Please try again later.' + (err.error?.message || ''),
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    const record = this.form.getRawValue();

    if (!record.patientId) {
      this.snack.open('Patient ID is missing', 'Close', { duration: 3000 });
      this.loading = false;
      return;
    }

    record.patientId = String(record.patientId); // enforce string

    if (this.isEdit && this.record?.id) {
      this.service.update(this.record.id, record).subscribe({
        next: () => {
          this.snack.open('Medical history updated successfully', 'Close', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/medical-history'], {
            queryParams: { patientId: record.patientId }
          });
        },
        error: (err) => {
          this.snack.open('Error updating medical history', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.service.create(record).subscribe({
        next: () => {
          this.snack.open('Medical history created successfully', 'Close', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/medical-history', record.patientId]);
        },
        error: (err) => {
          this.snack.open('Error creating medical history', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}