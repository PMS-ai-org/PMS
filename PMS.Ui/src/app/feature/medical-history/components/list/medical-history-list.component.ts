import { Component, OnInit } from '@angular/core';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistory } from '../../models/medical-history.model';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../core/shared/material.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'pms-medical-history-list',
  templateUrl: './medical-history-list.component.html',
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MaterialModule, MatTableModule
  ]
})
export class MedicalHistoryListComponent implements OnInit {
  records: MedicalHistory[] = [];
  selectedPatientId: string = 'e0d43bc2-7bb1-5b69-8a8a-fcacc203f4aa';
  dataSource = new MatTableDataSource<MedicalHistory>([]);
  displayedColumns: string[] = ['code', 'description', 'source', 'createdAt', 'actions'];
  
  constructor(private service: MedicalHistoryService) { }

  ngOnInit() {
    this.service.getByPatient(this.selectedPatientId).subscribe(data => {
      this.dataSource.data = data;
      console.log('Loaded records:', data);
    });
  }

  loadRecords() {
    this.service.getByPatient(this.selectedPatientId).subscribe({
      next: data => {
        this.dataSource.data = data;
        console.log('Loaded records:', this.dataSource.data);
      },
      error: err => console.error('Failed to load records:', err)
    });
  }

}
