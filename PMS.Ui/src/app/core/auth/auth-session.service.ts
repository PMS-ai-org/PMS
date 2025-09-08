import { Injectable, signal, computed, effect } from '@angular/core';
import { AuthResponse } from '../models/auth.models';
import { Site } from '../models/user.models';


@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  // Store session in memory using Angular signals
  private _session = signal<AuthResponse | null>(null);
  private _site = signal<Site | null>(null);

  // Expose readonly signals
  readonly session = computed(() => this._session());
  readonly isAuthenticated = computed(() => !!this._session());
  readonly userAccessDetail = computed(() => this._session()?.userAccessDetail?.[0] ?? null);
  readonly siteData = computed(() => this._site());

  constructor() {
    this._session.set(JSON.parse(sessionStorage.getItem('authSession') || 'null'));

    effect(() => {
      console.log(this._session());
    });
  }

  // Set session after login
  setSession(session: AuthResponse) {
    this._session.set(session);
    sessionStorage.setItem('authSession', JSON.stringify(session));
  }

  // Clear session on logout
  clearSession() {
    this._session.set(null);
    sessionStorage.removeItem('authSession');
  }

  // Get token directly (useful for interceptors)
  getToken(): string | null {
    return this._session()?.accessToken ?? null;
  }

  setCurrentSelectedSite(site: Site | null) {
    this._site.set(site);
  }
}
