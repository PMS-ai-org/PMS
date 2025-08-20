import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClinicService } from './clinic.service';
import { BehaviorSubject, Observable, switchMap, of, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private cache = new Map<string, any>(); // key: `${userId}_${clinic}_${site}`

  constructor(private http: HttpClient, private clinicSvc: ClinicService) {}

  // fetch permissions for current user in current clinic/site
  getPermissions(userId: string) : Observable<any> {
    // use clinicSvc.selected$ to get active context in components
    return this.clinicSvc.selected$.pipe(
      switchMap(ctx => {
        if (!ctx.clinicId || !ctx.siteId) return of(null);
        const key = `${userId}_${ctx.clinicId}_${ctx.siteId}`;
        if (this.cache.has(key)) return of(this.cache.get(key));
        return this.http.get<any>(`/api/user/permissions?userId=${userId}&clinicId=${ctx.clinicId}&siteId=${ctx.siteId}`).pipe(
          map(resp => {
            this.cache.set(key, resp);
            return resp;
          })
        );
      })
    );
  }

  clearCacheFor(userId: string, clinicId?: string, siteId?: string) {
    // simple clearing: clear all for user
    Array.from(this.cache.keys()).filter(k => k.startsWith(userId)).forEach(k => this.cache.delete(k));
  }
}
