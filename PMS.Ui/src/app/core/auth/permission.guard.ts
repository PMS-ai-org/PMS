/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService } from './permission.service';
import { map, take } from 'rxjs/operators';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private perm: PermissionService, private authSessionService: AuthSessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const feature = route.data['feature'] as string;
    const permission = route.data['permission'] as string; // CanView/CanAdd/...

    // get user id from stored auth
    const userId = this.authSessionService.session() ? this.authSessionService.session()?.userId : null;

    if (!userId) { void this.router.navigate(['/auth/login']); return false; }

    return this.perm.getPermissions(userId).pipe(
      take(1),
      map(perms => {
        if (!perms) { this.router.navigate(['/']); return false; }
        // perms assumed to be array or map from backend: adapt accordingly
        const f = perms.find((p: any) => p.featureName === feature);
        const allowed = f ? f[permission] === true : false;
        if (!allowed) this.router.navigate(['/']);
        return allowed;
      })
    );
  }
}
