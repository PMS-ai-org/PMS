import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RepositoryService } from './repository.service';
import { Router } from '@angular/router';
import { Patient } from '../models/patient.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = '/api/patients';

  private patientsSubject = new BehaviorSubject<Patient | undefined>(undefined);
  patients$: Observable<Patient | undefined> = this.patientsSubject.asObservable();

  constructor(private http: HttpClient, private repositoryService: RepositoryService, private repo: RepositoryService, private router: Router) { }

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
        console.error(`❌ Error fetching patient ${id}:`, err);
      }
    });
  }

  savePatient(patient: Patient, patientId: string | null): void {
    if(patientId){
      this.repo.updatePatient(patientId, patient).subscribe({
        next: () => {
          this.router.navigate(['/patient/search']);
        },
        error: (err) => {
          console.error('❌ Error updating patient:', err);
        }
      });
    }else{
      this.repo.addPatient(patient).subscribe({
      next: (newPatient) => {
        this.router.navigate(['/patient/search']);
      },
      error: (err) => {
        console.error('❌ Error adding patient:', err);
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

  // getById(id: string): Observable<Patient> {
  //   return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  // }

  // create(patient: Patient): Observable<Patient> {
  //   return this.http.post<Patient>(this.apiUrl, patient);
  // }

  // update(id: string, patient: Patient): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/${id}`, patient);
  // }

  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}