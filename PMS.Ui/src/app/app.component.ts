import { Patient } from './models/patient.model'; // Adjust the import path as necessary
import { Component, effect } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './core/shared/material.module';
import { AuthService } from './core/auth/auth.service';
import { SearchPatientResponse, SearchPatientResult } from './services/search-patient.service';
import { AuthSessionService } from './core/auth/auth-session.service';
import { LoginComponent } from './feature/auth/login/login.component';
import { Features, Site } from './core/models/user.models';
import { LoaderComponent } from './core/shared/loader-component/loader-component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'pms-root',
  imports: [RouterOutlet, RouterModule, MaterialModule, FormsModule, LoginComponent, LoaderComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedPatient?: Patient;
  userName: string = '';
  selectedSite = "";
  // Use the item type, not the response type
  rows: SearchPatientResult[] = [];
  sites: Site[] = [];
  features: Features[] = [];
  currentRole: string = '';
  role = "";
  showprofile = false;
  showappointment = false;
  showmedicalhistory = false;
  showregister = false;
  showtreatmentPlan = false;

  constructor(private authSession: AuthSessionService, private auth: AuthService) {
    {
      effect(() => {
        this.userName = this.authSession.session()?.fullName ?? "";
        this.role = this.authSession.session()?.role ?? "";
        this.sites = this.authSession.userAccessDetail()?.sites ?? [];
        this.selectedSite = this.sites[0]?.siteId ?? "";
        this.onSiteChange(this.selectedSite);
      });
    }
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
    this.selectedSite = siteId;
    const site = this.sites.find(s => s.siteId === this.selectedSite);
    this.authSession.setCurrentSelectedSite(site ?? null);
  }


  onPatientSelected(patient: Patient) {
    this.selectedPatient = patient;
  }
}