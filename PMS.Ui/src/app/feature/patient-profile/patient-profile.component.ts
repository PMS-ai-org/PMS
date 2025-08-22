import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
import { Patient } from '../../models/patient.model';
import { MaterialModule } from '../../core/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatChipsModule],
})
export class PatientProfileComponent implements OnInit {
  isLoading$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  patientData$:BehaviorSubject<Patient | null> = new BehaviorSubject<Patient | null>(null);

  constructor(
    private route: ActivatedRoute,
    private repositoryService: RepositoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading$.next(true);
      this.repositoryService.getPatientById(id).subscribe(patient => {
        this.patientData$.next(patient);
        this.isLoading$.next(false);
      });
    }
  }
}