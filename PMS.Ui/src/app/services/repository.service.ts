import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { Clinic } from '../models/clinic.model';
import { Site } from '../models/site.model';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${environment.apiUrl}/patients`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/doctors`);
  }

  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${environment.apiUrl}/clinics`);
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/sites`);
  }

  getMedicalHistory(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${environment.apiUrl}/medical-history`);
  }
}
