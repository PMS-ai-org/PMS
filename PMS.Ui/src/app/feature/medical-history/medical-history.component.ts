import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MedicalHistory } from '../../models/medical-history.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
@Component({
  selector: 'app-medical-history',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  patientId?: string;
  patientName = '';
  records: MedicalHistory[] = [];
  dataSource = new MatTableDataSource<MedicalHistory>([]);
  displayedColumns: string[] = ['code', 'description', 'source', 'createdAt', 'actions'];
  clinicId = '';
  siteId = '';

  constructor(private service: MedicalHistoryService,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit(): void {
    this.route.paramMap?.subscribe(params => {
      const patientId = params.get('patientId');
      if (patientId) {
        this.patientId = patientId;
        this.loadRecords(patientId);
        this.repositoryService.getPatientById(this.patientId).subscribe(patient => {
          this.patientName = patient.full_name; //Amy Robbins
        });
      }
    });
  }

  loadRecords(patientId: string) {
    this.service.getByPatient(patientId).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.clinicId = data.length > 0 ? (data[0].clinicId ?? '') : '';
        this.siteId = data.length > 0 ? (data[0].siteId ?? '') : '';
      },
      error: err => {
        this.snack.open(err?.error?.message || 'Failed to load records', 'Close', { duration: 3000 });
      }
    });
  }
}
