import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  patient?: Patient;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private repositoryService: RepositoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.repositoryService.getPatientById(id).subscribe(patient => {
        this.patient = patient;
        this.loading = false;
      });
    }
  }
}