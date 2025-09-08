/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { ClinicService } from './clinic.service';
import { take } from 'rxjs/operators';
import { AuthSessionService } from './auth-session.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const authSessionService = inject(AuthSessionService);
  const clinicSvc = inject(ClinicService);

  const token = authSessionService.session();

  // add auth header (if exists)
  let authReq = req;
  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  // Attach clinic/site headers
  let clinicCtx: { clinicId: string | null; siteId: string | null } = { clinicId: null, siteId: null };
  clinicSvc.selected$.pipe(take(1)).subscribe(x => (clinicCtx = x));

  if (clinicCtx.clinicId && clinicCtx.siteId) {
    authReq = authReq.clone({
      setHeaders: {
        ...authReq.headers.keys().reduce(
          (acc, k) => ({ ...acc, [k]: authReq.headers.get(k) ?? '' }),
          {}
        ),
        'X-Clinic-Id': clinicCtx.clinicId,
        'X-Site-Id': clinicCtx.siteId
      }
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
