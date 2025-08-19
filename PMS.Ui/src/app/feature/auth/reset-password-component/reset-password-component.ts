import { Component, OnInit} from '@angular/core';
import { MaterialModule } from '../../../core/shared/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { ResetPasswordDto } from '../../../core/models/auth.models';

@Component({
  selector: 'pms-reset-password-component',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.scss'
})
export class ResetPasswordComponent implements OnInit {
  constructor(private route: ActivatedRoute, private snack: MatSnackBar, private authService: AuthService, private router: Router) { }
  userId!: string;
  token!: string;
  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(10)]),
    confirmPassword: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
  }

  submit(): void {
    if (this.resetForm.invalid) {
      this.snack.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const { password, confirmPassword } = this.resetForm.value;
    if (password !== confirmPassword) {
      this.snack.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    const resetPasswordModel: ResetPasswordDto = { UserId: this.userId, Token: this.token, NewPassword: password! };
    this.authService.resetPassword(resetPasswordModel).subscribe({
      next: () => {
        this.snack.open('Password reset successful. Please login.', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Failed to reset password', 'Close', { duration: 3000 });
      }
    });
  }
}