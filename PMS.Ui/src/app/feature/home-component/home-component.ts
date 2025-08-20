import { Component } from '@angular/core';
import { MaterialModule } from '../../core/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pms-home-component',
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  
  constructor(public authSessionService: AuthSessionService) { }
}
