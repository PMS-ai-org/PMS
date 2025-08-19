import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchPatientResult {
  id: string;
  fullName: string;
  gender: string;
  age?: number;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  conditions?: string[] | null;
  medications?: string[] | null;
  snippet?: string | null;
  rank: number;
}

export interface SearchPatientResponse {
  total: number;
  items: SearchPatientResult[];
}
@Injectable({
  providedIn: 'root'
})
export class SearchPatientService {
  private apiUrl = 'https://localhost:7231/api/search'; 

  constructor(private http: HttpClient) {}

 searchPatients(
    term: string,
    pageSize = 10,
    pageIndex = 0
  ): Observable<SearchPatientResponse> {
    const params = {
      q: term,
      pageSize: pageSize.toString(),
      pageIndex: pageIndex.toString()
    };

    return this.http.get<SearchPatientResponse>(`${this.apiUrl}/patients`, { params });
  }
}
