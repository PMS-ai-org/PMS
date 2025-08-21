import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';

import { Patient } from './models/patient.model'; // Adjust the import path as necessary
import { AuthSessionService } from './core/auth/auth-session.service';
import { AuthService } from './core/auth/auth.service';
import { MaterialModule } from './core/shared/material.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './feature/auth/login/login.component';
@Component({
  selector: 'pms-root',
  standalone: true,
  imports: [MaterialModule, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedPatient?: Patient;
  userName: string = '';


  constructor(private authSession: AuthSessionService, private auth: AuthService) {
    {
      effect(() => {
        this.userName = this.authSession.session()?.fullName ?? "";
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


  onPatientSelected(patient: Patient) {
    this.selectedPatient = patient;
  }
}