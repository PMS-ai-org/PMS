import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pms-reset-password-request-component',
  imports: [],
  templateUrl: './reset-password-request-component.html',
  styleUrl: './reset-password-request-component.scss'
})
export class ResetPasswordRequestComponent {


  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  submit() {
    if (this.form.invalid) return;

    // this.authService.forgotPassword(this.form.value.email!)
    //   .subscribe({
    //     next: () => this.snackBar.open('Reset link sent to your email', 'OK', { duration: 3000 }),
    //     error: () => this.snackBar.open('Failed to send reset link', 'OK', { duration: 3000 })
    //   });
  }
}
