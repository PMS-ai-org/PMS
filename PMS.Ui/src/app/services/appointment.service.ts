import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: string;
  patientId: string;
  bookedAt: string;
  scheduledAt: string;
  reminderSent?: boolean;
  status?: string;
  leadTimeHours?: number;
  dow?: number;
  hourOfDay?: number;
  siteId?: string;
  clinicId?: string;
  treatmentPlan?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  getByPatient(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  update(id: string, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}