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
import { InsurancePlan, InsuranceProvider, PatientInsurance, PatientInsuranceDto } from '../models/insurance';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private http = inject(HttpClient);

  getUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${environment.apiUrl}/clinics/get-staff`);
  }
  
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}/admin/roles`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments/get-appointments`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${environment.apiUrl}/patients`);
  }

  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${environment.apiUrl}/clinics/get-clinics`);
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/clinics/get-sites`);
  }

  getUserClinicSites(): Observable<UserClinicSite[]> {
    return this.http.get<UserClinicSite[]>(`${environment.apiUrl}/clinics/get-user-clinic-sites`);
  }

  getAllMedicalHistory(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${environment.apiUrl}/medicalhistory`);
  }
  
  getMedicalHistory(patientId: string): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${environment.apiUrl}/medicalhistory/?patientid=${patientId}`);
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

  search(query: string, page: number = 1, pageSize: number = 10): Observable<{ results: Patient[], totalCount: number }> {
    return this.http.get<{ results: Patient[], totalCount: number }>(
      `${environment.apiUrl}/patients/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
    );
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiUrl}/Patients/${id}`);
  }

  // Add new patient
  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${environment.apiUrl}/Patients`, patient);
  }

  updatePatient(id: string, patient: Patient): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Patients/${id}`, patient);
  }

  // Delete patient
  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Patients/${id}`);
  }

  //Insurance APIs
  getProviders() { return this.http.get<InsuranceProvider[]>(`${environment.apiUrl}/insurance/providers`); }
  getPlans() { return this.http.get<InsurancePlan[]>(`${environment.apiUrl}/insurance/plans`); }
  getPatientInsurances(patientId: string) { return this.http.get<PatientInsurance[]>(`${environment.apiUrl}/insurance/patients/${patientId}/insurances`); }
  addPatientInsurance(patientId: string, payload: PatientInsuranceDto){ return this.http.post(`${environment.apiUrl}/insurance/patients/${patientId}/insurances`, payload); }
  updatePatientInsurance(id: string, payload: PatientInsuranceDto){ return this.http.put(`${environment.apiUrl}/insurance/patient-insurances/${id}`, payload); }

  getPlansByProviderId(providerId: string) { return this.http.get<InsurancePlan[]>(`${environment.apiUrl}/insurance/providers/${providerId}/plans`); }
  deletePatientInsurance(patientId: string, id: string){ return this.http.delete(`${environment.apiUrl}/insurance/patients/${patientId}/insurances/${id}`); }
}