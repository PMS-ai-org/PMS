import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { LoginRequest, AuthResponse, ForgotPasswordDto, ResetPasswordDto } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private authSession: AuthSessionService) { }
  
  private storeAuth(res: AuthResponse) {
    this.authSession.setSession({
      accessToken: res.accessToken,
      expiresAt: res.expiresAt,
      refreshToken: res.refreshToken,
      role: res.role,
      userId: res.userId,
      fullName: res.fullName,
      userAccessDetail: res.userAccessDetail
    });
  }

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto).pipe(
      tap(r => this.storeAuth(r))
    );
  }

  logout(): Observable<any> {
    this.authSession.clearSession();
    return of(true);
  }

  forgotPassword(dto: ForgotPasswordDto, frontendBaseUrl: string) {
    return this.http.post(`${this.api}/forgot-password`, dto, {
      headers: { 'X-Frontend-BaseUrl': frontendBaseUrl }
    });
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.http.post(`${this.api}/reset-password`, dto);
  }

  refreshToken(refreshToken: string) {
    return this.http.post<AuthResponse>(`${this.api}/refresh`, { refreshToken }).pipe(
      tap(r => this.storeAuth(r)),
      catchError(err => {
        this.logout();
        throw err;
      })
    );
  }

  // // helper to decode JWT
  // decodeToken(): any | null {
  //   const token = this.authSession.getToken();
  //   if (!token) return null;
  //   try {
  //     return jwt_decode(token);
  //   }
  //   catch { return null; }
  // }
}
