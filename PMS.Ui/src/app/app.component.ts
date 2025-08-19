import { Component, effect, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './core/shared/material.module';
import { AuthService } from './core/auth/auth.service';
import { AuthSessionService } from './core/auth/auth-session.service';
import { LoginComponent } from './feature/auth/login/login.component';

@Component({
  selector: 'pms-root',
  imports: [RouterOutlet, RouterModule, MaterialModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'pms-root' }
})
export class AppComponent {
  userName = "";

  constructor(private authSession: AuthSessionService, private auth: AuthService) {

    effect(() => {
      this.userName = this.authSession.session()?.fullName ?? "";
    });
  }

  ngOnInit() {
    this.userName = this.authSession.session()?.fullName ?? "";
  }

  isLoggedIn() {
    return this.authSession.session();
  }

  logout() {
    this.auth.logout();
  }
}
