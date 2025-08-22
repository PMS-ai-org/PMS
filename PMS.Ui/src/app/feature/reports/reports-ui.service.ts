/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { catchError, Observable, of } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { Role } from '../../models/role.model';
import { Feature } from '../../models/feature.model';
import { UserAccess } from '../../models/user-access.model';
import { Clinic } from '../../models/clinic.model';
import { Site } from '../../models/site.model';
import { MedicalHistory } from '../../models/medical-history.model';
import { UserLogin } from '../../models/user-login.model';
import { PasswordResetToken } from '../../models/password-reset-token.model';
import { RefreshToken } from '../../models/refresh-token.model';
import { UserClinicSite } from '../../models/user-clinic-site.model';

@Injectable({ providedIn: 'root' })
export class ReportsUiService {
  constructor(private reportsService: ReportsService) {}

  getAppointments(): Observable<Appointment[]> {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: '1',
        bookedAt: '2025-08-01T10:00:00Z',
        scheduledAt: '2025-08-02T10:00:00Z',
        reminderSent: true,
        status: 'Scheduled',
        leadTimeHours: 24,
        dow: 1,
        hourOfDay: 10,
        siteId: '1',
        clinicId: '1',
        treatmentPlan: '{}',
        created_by: 'system',
        updated_by: 'system'
      },
      {
        id: '2',
        patientId: '2',
        bookedAt: '2025-08-03T11:00:00Z',
        scheduledAt: '2025-08-04T11:00:00Z',
        reminderSent: false,
        status: 'Completed',
        leadTimeHours: 24,
        dow: 2,
        hourOfDay: 11,
        siteId: '2',
        clinicId: '2',
        treatmentPlan: '{}',
        created_by: 'system',
        updated_by: 'system'
      }
    ];
    return this.reportsService.getAppointments().pipe(
      catchError(() => of(mockAppointments))
    );
  }

  getPatients(): Observable<Patient[]> {
    const mockPatients: Patient[] = [
      {
        id: '1',
        full_name: 'John Doe',
        gender: 'Male',
        dob: '1990-01-01',
        phone: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        age: 35,
        conditions: ['Diabetes'],
        medications: ['Metformin'],
        notes: '',
        homeClinicId: '1',
        homeSiteId: '1',
        created_by: 'system',
        updated_by: 'system'
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        gender: 'Female',
        dob: '1985-05-15',
        phone: '0987654321',
        email: 'jane@example.com',
        address: '456 Elm St',
        age: 40,
        conditions: ['Hypertension'],
        medications: ['Amlodipine'],
        notes: '',
        homeClinicId: '2',
        homeSiteId: '2',
        created_by: 'system',
        updated_by: 'system'
      }
    ];
    return this.reportsService.getPatients().pipe(
      catchError(() => of(mockPatients))
    );
  }
  getFeatures(): Observable<Feature[]> {
    const mockFeatures: Feature[] = [
      { FeatureId: '1', FeatureName: 'Appointments' },
      { FeatureId: '2', FeatureName: 'Patients' }
    ];
    return this.reportsService.getFeatures().pipe(
      catchError(() => of(mockFeatures))
    );
  }
  
  getRoles(): Observable<Role[]> {
    const mockRoles: Role[] = [
      { RoleId: '1', RoleName: 'Admin', created_at: new Date('2025-08-01T09:00:00Z'), created_by: 'system', updated_at: new Date('2025-08-01T09:00:00Z'), updated_by: 'system' },
      { RoleId: '2', RoleName: 'Doctor', created_at: new Date('2025-08-03T10:00:00Z'), created_by: 'system', updated_at: new Date('2025-08-03T10:00:00Z'), updated_by: 'system' }
    ];
    return this.reportsService.getRoles().pipe(
      catchError(() => of(mockRoles))
    );
  }

  getUserAccesses(): Observable<UserAccess[]> {
    const mockUserAccesses: UserAccess[] = [
      { UserAccessId: '1', UserClinicSiteId: '1', FeatureId: '1', CanAdd: true, CanEdit: true, CanDelete: false, CanView: true },
      { UserAccessId: '2', UserClinicSiteId: '2', FeatureId: '2', CanAdd: false, CanEdit: true, CanDelete: false, CanView: true }
    ];
    return this.reportsService.getUserAccesses().pipe(
      catchError(() => of(mockUserAccesses))
    );
  }
  
  getUserClinicSites(): Observable<UserClinicSite[]> {
    const mockUserClinicSites: UserClinicSite[] = [
      { userClinicSiteId: '1', userId: '1', clinicId: '1', siteId: '1' },
      { userClinicSiteId: '2', userId: '2', clinicId: '2', siteId: '2' }
    ];
    return this.reportsService.getUserClinicSites().pipe(
      catchError(() => of(mockUserClinicSites))
    );
  }

  getClinics(): Observable<Clinic[]> {
  const mockClinics: Clinic[] = [
    { 
      id: '1', 
      name: 'Clinic A', 
      speciality: 'General',
    },
    { 
      id: '2', 
      name: 'Clinic B', 
      speciality: 'Pediatrics',
    }
  ];
  return this.reportsService.getClinics().pipe(
    catchError(() => of(mockClinics))
  );
}

getSites(): Observable<Site[]> {
  const mockSites: Site[] = [
    { 
      id: '1', 
      clinic_id: '1', 
      name: 'Site A', 
      neighborhood: 'North', 
      address: '123 Main St', 
      city: 'Metropolis', 
      state: 'NY', 
      lat: 40.7128, 
      lon: -74.0060, 
      created_at: new Date('2025-08-01T09:00:00Z'), 
      created_by: 'system', 
      updated_at: new Date('2025-08-01T09:00:00Z'), 
      updated_by: 'system' 
    },
    { 
      id: '2', 
      clinic_id: '2', 
      name: 'Site B', 
      neighborhood: 'South', 
      address: '456 Elm St', 
      city: 'Gotham', 
      state: 'IL', 
      lat: 41.8781, 
      lon: -87.6298, 
      created_at: new Date('2025-08-03T10:00:00Z'), 
      created_by: 'system', 
      updated_at: new Date('2025-08-03T10:00:00Z'), 
      updated_by: 'system' 
    }
  ];
  return this.reportsService.getSites().pipe(
    catchError(() => of(mockSites))
  );
}


  getMedicalHistory(): Observable<MedicalHistory[]> {
    const mockMedicalHistory: MedicalHistory[] = [
      { id: '1', patientId: '1', code: 'A01', description: 'Flu', source: 'Doctor', clinicId: '1', siteId: '1', created_at: new Date('2025-08-01T09:00:00Z'), created_by: 'system', updated_at: new Date('2025-08-01T09:00:00Z'), updated_by: 'system' },
      { id: '2', patientId: '2', code: 'B02', description: 'Dental Check', source: 'Dentist', clinicId: '2', siteId: '2', created_at: new Date('2025-08-03T10:00:00Z'), created_by: 'system', updated_at: new Date('2025-08-03T10:00:00Z'), updated_by: 'system' }
    ];
    return this.reportsService.getMedicalHistory().pipe(
      catchError(() => of(mockMedicalHistory))
    );
  }

  getUserLogins(): Observable<UserLogin[]> {
    const mockUserLogins: UserLogin[] = [
      { UserId: '1', Username: 'admin', Email: 'admin@pms.com', RoleId: '1', IsActive: true },
      { UserId: '2', Username: 'doctor', Email: 'doctor@pms.com', RoleId: '2', IsActive: true }
    ];
    return this.reportsService.getUserLogins().pipe(
      catchError(() => of(mockUserLogins))
    );
  }

  getPasswordResetTokens(): Observable<PasswordResetToken[]> {
    const mockPasswordResetTokens: PasswordResetToken[] = [
      { Id: '1', Token: 'reset-token-1', Expires: '2025-08-10T10:00:00Z', UserId: '1', IsUsed: false, Created: '2025-08-01T09:00:00Z' }
    ];
    return this.reportsService.getPasswordResetTokens().pipe(
      catchError(() => of(mockPasswordResetTokens))
    );
  }

  getRefreshTokens(): Observable<RefreshToken[]> {
    const mockRefreshTokens: RefreshToken[] = [
      { Id: '1', Token: 'refresh-token-1', Expires: '2025-08-10T10:00:00Z', IsRevoked: false, UserId: '1', Created: '2025-08-01T09:00:00Z' }
    ];
    return this.reportsService.getRefreshTokens().pipe(
      catchError(() => of(mockRefreshTokens))
    );
  }
}
