import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { MaterialModule } from '../../../core/shared/material.module';

function matchPassword(ctrl: AbstractControl): ValidationErrors | null {
  const p = ctrl.get('password')?.value;
  const c = ctrl.get('confirm')?.value;
  return p && c && p === c ? null : { mismatch: true };
}

@Component({
  selector: 'pms-register',
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MaterialModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;
  form!:FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    }, { validators: matchPassword });
  }


  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const { email, password } = this.form.value;

    // DO NOT keep token here. Redirect to login on success.
    this.auth.register(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Registration successful. Please log in.', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.snack.open(err?.error?.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }
}
