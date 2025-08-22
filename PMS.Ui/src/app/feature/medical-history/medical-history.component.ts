import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MedicalHistory } from '../../models/medical-history.model';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-medical-history',
  imports:[ CommonModule, ReactiveFormsModule, RouterLink, MaterialModule ],
  
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  records: MedicalHistory[] = [];
  selectedPatientId: string = 'e0d43bc2-7bb1-5b69-8a8a-fcacc203f4aa';
  dataSource = new MatTableDataSource<MedicalHistory>([]);
  displayedColumns: string[] = ['code', 'description', 'source', 'createdAt', 'actions'];

  constructor(private service: MedicalHistoryService,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.service.getByPatient(this.selectedPatientId).subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        this.snack.open(err?.error?.message || 'Failed to load records', 'Close', { duration: 3000 });
      }
    });
  }
}