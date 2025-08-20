import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalHistory {
  id?: string;
  patientId: string;
  code: string;
  description: string;
  source?: string;
  createdAt?: string;
  clinicId?: string;
  siteId?: string;
}

@Injectable({ providedIn: 'root' })
export class MedicalHistoryService {
  private apiUrl = '/api/medicalhistory';

  constructor(private http: HttpClient) {}

  getByPatient(patientId: string): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getById(id: string): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${id}`);
  }

  create(history: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, history);
  }

  update(id: string, history: MedicalHistory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, history);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}