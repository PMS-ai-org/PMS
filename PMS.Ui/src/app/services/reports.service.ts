import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { UserDetail } from '../models/user-detail.model';
import { Patient } from '../models/patient.model';
import { Clinic } from '../models/clinic.model';
import { Site } from '../models/site.model';
import { RepositoryService } from './repository.service';
import { MedicalHistory } from '../models/medical-history.model';
import { UserClinicSite } from '../models/user-clinic-site.model';
import { Role } from '../models/role.model';
import { Feature } from '../models/feature.model';
import { UserAccess } from '../models/user-access.model';
import { UserLogin } from '../models/user-login.model';
import { PasswordResetToken } from '../models/password-reset-token.model';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private repository = inject(RepositoryService);

  getUsers(): Observable<UserDetail[]> {
    return this.repository.getUsers();
  }
  
  getRoles(): Observable<Role[]> {
    return this.repository.getRoles();
  }

  getAppointments(): Observable<Appointment[]> {
    return this.repository.getAppointments();
  }

  getPatients(): Observable<Patient[]> {
    return this.repository.getPatients();
  }

  getClinics(): Observable<Clinic[]> {
    return this.repository.getClinics();
  }

  getSites(): Observable<Site[]> {
    return this.repository.getSites();
  }
  
  getUserClinicSites(): Observable<UserClinicSite[]> {
    return this.repository.getUserClinicSites();
  }

  getAllMedicalHistory(): Observable<MedicalHistory[]> {
    return this.repository.getAllMedicalHistory();
  }
  
  getMedicalHistory(patientId: string): Observable<MedicalHistory[]> {
    return this.repository.getMedicalHistory(patientId);
  }

  getFeatures(): Observable<Feature[]> {
    return this.repository.getFeatures();
  }

  getUserAccesses(): Observable<UserAccess[]> {
    return this.repository.getUserAccesses();
  }

  getUserLogins(): Observable<UserLogin[]> {
    return this.repository.getUserLogins();
  }

  getPasswordResetTokens(): Observable<PasswordResetToken[]> {
    return this.repository.getPasswordResetTokens();
  }

  getRefreshTokens(): Observable<RefreshToken[]> {
    return this.repository.getRefreshTokens();
  }
}
