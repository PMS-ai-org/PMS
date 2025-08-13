import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStoreService } from './token-store.service';
import { getExpiry } from './jwt.utils';

interface AuthResponse {
  accessToken: string;
  expiresUtc: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenStore = inject(TokenStoreService);
  private router = inject(Router);

  /** Public signal for app & toolbar */
  isAuthorized = signal(false);

  /** Bridge the token stream to a signal and keep isAuthorized in sync */
  private tokenSig = toSignal(this.tokenStore.tokenChanges$, { initialValue: null });

  constructor() {
    effect(() => {
      const t = this.tokenSig();
      if (!t) { this.isAuthorized.set(false); return; }
      const exp = getExpiry(t);
      this.isAuthorized.set(!!exp && exp.getTime() > Date.now());
    });
  }

  /** === API calls === */

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.installToken(res)));
  }

  /** Register: per your requested flow, DO NOT keep token; go back to /login */
  register(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password });
  }

  logout(navigate = true) {
    this.tokenStore.clear();
    if (navigate) { void this.router.navigate(['/login']); }
  }

  /** Attach token and auto-expiry */
  private installToken(res: AuthResponse) {
    const exp = getExpiry(res.accessToken) ?? new Date(res.expiresUtc);
    this.tokenStore.set(res.accessToken, exp);
  }

  /** For guards */
  isAuthenticatedNow(): boolean {
    const t = this.tokenStore.get();
    if (!t) return false;
    const exp = getExpiry(t);
    return !!exp && exp.getTime() > Date.now();
  }

  getToken(): string | null { return this.tokenStore.get(); }
}
