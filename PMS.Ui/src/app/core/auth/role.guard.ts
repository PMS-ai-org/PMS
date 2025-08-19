import { effect, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthSessionService } from './auth-session.service';
import { AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authSessionService: AuthSessionService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot) {
    debugger;
    const roles = route.data['roles'] as string[] | string;
    const user = this.authSessionService.session();
    if (!user) { void this.router.navigate(['/login']); return false; }
    const has = Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
    if (!has) { void this.router.navigate(['/']); }
    return has;
  }
}
