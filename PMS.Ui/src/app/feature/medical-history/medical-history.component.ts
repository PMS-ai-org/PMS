import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicalHistoryService, MedicalHistory } from '../../services/medical-history.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/shared/material.module';
@Component({
  selector: 'app-medical-history',
  imports:[MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  @Input() patientId = '';
  historyList: MedicalHistory[] = [];
  editingId?: string = undefined;
  error: string | null = null;
historyForm: FormGroup; // Or better: FormGroup
  

  constructor(private fb: FormBuilder, private historyService: MedicalHistoryService) {
  this.historyForm = this.fb.group({
    code: ['', Validators.required],
    description: ['', Validators.required],
    source: [''],
    clinicId: [''],
    siteId: ['']
  }); 
}
  ngOnInit(): void {
    if (this.patientId) {
      this.loadHistory();
    }
  }

  loadHistory() {
    this.historyService.getByPatient(this.patientId).subscribe(res => this.historyList = res);
  }

  onSubmit() {
    const entry: MedicalHistory = {
      ...this.historyForm.value,
      patientId: this.patientId,
      createdAt: new Date().toISOString()
    };
    if (this.editingId) {
      this.historyService.update(this.editingId, entry).subscribe({
        next: () => {
          this.editingId = undefined;
          this.historyForm.reset();
          this.loadHistory();
        },
        error: err => this.error = err.message
      });
    } else {
      this.historyService.create(entry).subscribe({
        next: () => {
          this.historyForm.reset();
          this.loadHistory();
        },
        error: err => this.error = err.message
      });
    }
  }

  edit(entry: MedicalHistory) {
    this.editingId = entry.id;
    this.historyForm.patchValue(entry);
  }

  delete(id: string) {
    this.historyService.delete(id).subscribe(() => this.loadHistory());
  }
}