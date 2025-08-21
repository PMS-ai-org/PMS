import { Component, effect } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './core/shared/material.module';
import { AuthService } from './core/auth/auth.service';
import { SearchPatientResponse, SearchPatientResult } from './services/search-patient.service';
import { SearchPatientComponent } from "./feature/patient-search/search-patient/search-patient.component";
import { AuthSessionService } from './core/auth/auth-session.service';
import { LoginComponent } from './feature/auth/login/login.component';
import { LoaderComponent } from './core/shared/loader-component/loader-component';
import { Features, Site } from './core/models/user.models';

@Component({
  selector: 'pms-root',
  imports: [RouterOutlet, RouterModule, MaterialModule, LoginComponent,
     SearchPatientComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'pms-root' }
})
export class AppComponent {
  // Use the item type, not the response type
  rows: SearchPatientResult[] = [];
  sites: Site[] = [];
  features: Features[] = [];

  userName = "";

  constructor(private authSession: AuthSessionService, private auth: AuthService) {
    effect(() => {
      this.userName = this.authSession.session()?.fullName ?? "";
      this.sites = this.authSession.userAccessDetail()?.sites ?? [];
    console.log(this.sites);
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
  
  onResults(res: SearchPatientResponse) {
    this.rows = res.items ?? [];
  }

  onSiteChange(siteId: string) {
    console.log('Selected site ID:', siteId);
  }
}
