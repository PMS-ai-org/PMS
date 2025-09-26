import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RepositoryService } from './repository.service';
import { Router } from '@angular/router';
import { Patient } from '../models/patient.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = '/api/patients';

  private patientsSubject = new BehaviorSubject<Patient | undefined>(undefined);
  patients$: Observable<Patient | undefined> = this.patientsSubject.asObservable();

  constructor(private http: HttpClient, private repositoryService: RepositoryService, private repo: RepositoryService, private router: Router,  private toast: ToastService) { }

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

 search(query: string, page: number = 1, pageSize: number = 10): Observable<{ results: Patient[], totalCount: number }> {
  return this.repositoryService.search(query, page, pageSize);
}

  loadPatientById(id: string): void {
    this.repo.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientsSubject.next(patient);
      },
      error: (err) => {
        this.toast.error(`Error fetching patient ${id}: ${err.message}`);
      }
    });
  }

  savePatient(patient: Patient, patientId: string | null, isNavigate = true): void {
    if(patientId){
      this.repo.updatePatient(patientId, patient).subscribe({
        next: (res) => {
          console.log(res)
          // After patient update decide how to handle insurance per request:
          // "if hasInsurance true then call addPatientInsurance api if its false call updatePatientInsurance"
          // (Note: this appears inverted logically, but implemented as specified.)
          if (patient.insurance) {
            if (patient?.insurance?.insuranceId) {
              patient.insurance.patientId = patientId
              // Update requires an insurance id; if not present we skip
              this.repo.updatePatientInsurance(patient.insurance.insuranceId, patient.insurance).subscribe({
                next: () => this.toast.success('Insurance updated'),
                error: () => this.toast.error('Error updating insurance')
              });
            } else {
              // Call add (spec as given)
              patient.insurance.patientId = patientId;
              this.repo.addPatientInsurance(patientId, patient.insurance).subscribe({
                next: () => this.toast.success('Insurance added'),
                error: () => this.toast.error('Error adding insurance')
              });
            }
          } 
          if (isNavigate) {
            this.router.navigate(['/patient/profile', patientId]);
          }
          this.toast.success('Patient saved successfully');
        },
        error: (err) => {
          this.toast.error('Error updating patient');
        }
      });
    }else{
      this.repo.addPatient(patient).subscribe({
      next: (newPatient) => {
        if(newPatient.id && patient.insurance){
          patient.insurance.patientId = newPatient.id;
          this.repo.addPatientInsurance(newPatient.id, patient.insurance).subscribe({
            next: () => {
              this.toast.success('Patient added successfully with insurance');
            },
            error: (err) => {
              this.toast.error('Error adding patient insurance');
            }
          });
        }
        this.router.navigate(['/patient/profile', newPatient.id]);
        this.toast.success('Patient added successfully');
      },
      error: (err) => {
        this.toast.error('Error adding patient');
      }
    });
    }
  }

  deletePatient(id: string): void {
    this.repo.deletePatient(id).subscribe({
      next: () => {
        console.log(`✅ Patient ${id} deleted successfully`);
      },
      error: (err) => {
        console.error(`❌ Error deleting patient ${id}:`, err);
      }
    });
  }

  getInsurancePlan(id: string): void {
    this.repo.getPatientInsurances(id).subscribe({
      next: (insurances) => {
        console.log(`✅ Patient ${id} insurances fetched successfully`, insurances);
      },
      error: (err) => {
        console.error(`❌ Error fetching patient ${id} insurances:`, err);
      }
    });
  }

  // this.insuranceService.getPlans(providerId).subscribe(plans => this.plans = plans);
}