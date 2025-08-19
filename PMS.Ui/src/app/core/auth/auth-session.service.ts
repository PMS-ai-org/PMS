import { Injectable, signal, computed, effect } from '@angular/core';
import { AuthResponse } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  // Store session in memory using Angular signals
  private _session = signal<AuthResponse | null>(null);

  // Expose readonly signals
  readonly session = computed(() => this._session());
  readonly isAuthenticated = computed(() => !!this._session());

  constructor() {
    effect(() => {
        console.log(this._session());
    });
  }

  // Set session after login
  setSession(session: AuthResponse) {
    this._session.set(session);
  }

  // Clear session on logout
  clearSession() {
    this._session.set(null);
  }

  // Get token directly (useful for interceptors)
  getToken(): string | null {
    return this._session()?.accessToken ?? null;
  }
}
