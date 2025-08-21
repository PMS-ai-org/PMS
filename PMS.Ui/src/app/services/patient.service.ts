import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  id?: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  age?: number;
  conditions?: string[];
  medications?: string[];
  notes?: string;
  createdAt?: string;
  homeClinicId?: string;
  homeSiteId?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = '/api/patients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

 search(query: string, page: number = 1, pageSize: number = 10): Observable<{ results: Patient[], totalCount: number }> {
  return this.http.get<{ results: Patient[], totalCount: number }>(
    `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
  );
}

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  update(id: string, patient: Patient): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, patient);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}