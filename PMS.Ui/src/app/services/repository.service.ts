import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../models/appointment.model';
import { UserDetail } from '../models/user-detail.model';
import { Patient } from '../models/patient.model';
import { Clinic } from '../models/clinic.model';
import { Site } from '../models/site.model';
import { MedicalHistory } from '../models/medical-history.model';
import { UserClinicSite } from '../models/user-clinic-site.model';
import { Role } from '../models/role.model';
import { Feature } from '../models/feature.model';
import { UserAccess } from '../models/user-access.model';
import { UserLogin } from '../models/user-login.model';
import { PasswordResetToken } from '../models/password-reset-token.model';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private http = inject(HttpClient);

  getUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${environment.apiUrl}/users`);
  }
  
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}/roles`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${environment.apiUrl}/patients`);
  }

  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${environment.apiUrl}/clinics`);
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/sites`);
  }

  getUserClinicSites(): Observable<UserClinicSite[]> {
    return this.http.get<UserClinicSite[]>(`${environment.apiUrl}/user-clinic-sites`);
  }

  getMedicalHistory(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${environment.apiUrl}/medical-history`);
  }

  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${environment.apiUrl}/features`);
  }

  getUserAccesses(): Observable<UserAccess[]> {
    return this.http.get<UserAccess[]>(`${environment.apiUrl}/user-accesses`);
  }

  getUserLogins(): Observable<UserLogin[]> {
    return this.http.get<UserLogin[]>(`${environment.apiUrl}/user-logins`);
  }

  getPasswordResetTokens(): Observable<PasswordResetToken[]> {
    return this.http.get<PasswordResetToken[]>(`${environment.apiUrl}/password-reset-tokens`);
  }

  getRefreshTokens(): Observable<RefreshToken[]> {
    return this.http.get<RefreshToken[]>(`${environment.apiUrl}/refresh-tokens`);
  }
}