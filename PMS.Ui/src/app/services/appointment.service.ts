import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) { }

  getByPatient(patientId: string): Observable<Appointment[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/appointments/patient/${patientId}`).pipe(
      map((appointments : any[]) =>
        appointments.map((app: any) =>({
          ...app,
          patientId: app.patient_id,
          bookedAt: app.booked_at,
          scheduledAt: app.scheduled_at,
          clinic_id: app.clinic_id,
          treatment_plan: app.treatment_plan ? JSON.parse(app.treatment_plan) : null
        }))
      )
    );
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.apiUrl}/appointments`, appointment);
  }

  update(id: string, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Appointments/${id}`, appointment);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}