import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Clinic, Site } from '../models/user.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  private api = environment.apiUrl;
  private _selected = new BehaviorSubject<{ clinicId: string | null; siteId: string | null }>({ clinicId: null, siteId: null });
  selected$ = this._selected.asObservable();

  constructor(private http: HttpClient) { }

  setContext(clinicId: string, siteId: string) {
    this._selected.next({ clinicId, siteId });
  }

  clearContext() {
    this._selected.next({ clinicId: null, siteId: null });
  }

  // optional APIs to fetch clinics & sites
  getClinics() { return this.http.get<Clinic[]>(`${this.api}/Clinics/get-clinics`); }
  getSitesByClinic(clinicId: string) { return this.http.get<Site[]>(`${this.api}/Clinics/${clinicId}/sites`); }

  saveDoctor(formData: any) {
    return this.http.post(`${this.api}/Clinics/create-doctor`, formData);
  }
}
