import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthSessionService, private router: Router) { }
  canActivate() {
    const user = this.auth.session();
    if (!user) {
      //this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
