import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MedicalHistory } from '../models/medical-history.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private baseUrl = `${environment.apiUrl}/MedicalHistory`;

  constructor(private http: HttpClient) { }

  getByPatient(patientId: string): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.baseUrl}?patientId=${patientId}`);
  }

  // getByPatient(patientId: string): Observable<MedicalHistory[]> {
  //   return this.http
  //     .get<any[]>(`${this.baseUrl}?patientId=${patientId}`)   // ✅ query param
  //     .pipe(
  //       map(records => {
  //         console.log('Raw API response:', records); // debug
  //         return records.map(r => ({
  //           id: r.id,
  //           patientId: r.patient_id,
  //           code: r.code,
  //           description: r.description,
  //           source: r.source,
  //           createdAt: r.created_at,
  //           clinicId: r.clinic_id,
  //           siteId: r.site_id
  //         }));
  //       })
  //     );
  // }

  getById(id: string): Observable<MedicalHistory> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => ({
        id: data.id,
        patientId: data.patient_id,
        code: data.code,
        description: data.description,
        source: data.source,
        createdAt: data.created_at,
        clinicId: data.clinic_id,
        siteId: data.site_id,
        created_by: data.created_by,
        updated_at: data.updated_at,
        updated_by: data.updated_by
      }))
    );
  }

  create(record: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.baseUrl, record);
  }

  update(id: string, record: MedicalHistory): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.baseUrl}/${id}`, record);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
