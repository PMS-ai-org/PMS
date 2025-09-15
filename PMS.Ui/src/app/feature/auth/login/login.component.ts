import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MaterialModule } from '../../../core/shared/material.module';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { LoaderService } from '../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'pms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MaterialModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;
  form!: FormGroup;

  constructor(private loaderService: LoaderService, private snack: MatSnackBar, private auth: AuthService, private router: Router, private toastService: ToastService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.loaderService.show();
    this.auth.login(this.form.value).subscribe((res: any) => {
      if (res.requirePasswordReset) {
        this.router.navigate(['/reset-password'], {
          queryParams: { userId: res.userId, token: res.accessToken }
        });
      } else {

        this.router.navigate(['/home']);
      }
      this.loaderService.hide();
    },
      (err) => {
        console.error(err);
        this.loaderService.hide();
        this.toastService.error(err.error?.message || 'Login failed');
      });
  }
}
