import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MaterialModule } from '../../../core/shared/material.module';
import { AuthSessionService } from '../../../core/auth/auth-session.service';

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

  constructor(private authSession: AuthSessionService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.login(this.form.value).subscribe((res: any) => {
      debugger;
      if (res.requirePasswordReset) {
        this.router.navigate(['/reset-password'], {
          queryParams: { userId: res.userId, token: res.accessToken }
        });
      } else {
        
        this.router.navigate(['/home']);
      }
    });
  }
}
