/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { MaterialModule } from '../../../core/shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pms-login',
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  form!: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.login(email!, password!)
      .subscribe({
        next: () => {
          this.loading = false;
          // Auth signal flips to true via token store → go to main page
          this.router.navigate(['/todos']);
        },
        error: err => {
          this.loading = false;
          this.snack.open(err?.error?.message || 'Login failed', 'Close', { duration: 3000 });
        }
      });
  }
}
