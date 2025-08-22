import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { ResetPasswordComponent } from './reset-password-component';
import { AuthService } from '../../../core/auth/auth.service';

class MockActivatedRoute {
  snapshot = {
    queryParamMap: {
      get: (key: string) => {
        if (key === 'token') return 'test-token';
        if (key === 'userId') return 'test-user';
        return null;
      }
    }
  };
}

class MockSnackBar {
  open = jest.fn();
}

class MockAuthService {
  resetPassword = jest.fn().mockReturnValue(of({}));
}

class MockRouter {
  navigate = jest.fn();
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let snack: MockSnackBar;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    snack = new MockSnackBar();
    authService = new MockAuthService();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MatSnackBar, useValue: snack },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set token and userId from query params', () => {
      component.ngOnInit();
      expect(component.token).toBe('test-token');
      expect(component.userId).toBe('test-user');
    });
  });

  xdescribe('submit', () => {
    it('should show snack if form is invalid', () => {
      component.resetForm.get('password')?.setValue('');
      component.resetForm.get('confirmPassword')?.setValue('');
      component.submit();
      expect(snack.open).toHaveBeenCalledWith('Please fill all required fields', 'Close', { duration: 3000 });
    });

    it('should show snack if passwords do not match', () => {
      component.resetForm.get('password')?.setValue('1234567890');
      component.resetForm.get('confirmPassword')?.setValue('1234567891');
      component.submit();
      expect(snack.open).toHaveBeenCalledWith('Passwords do not match', 'Close', { duration: 3000 });
    });

    it('should call authService.resetPassword and navigate on success', () => {
      component.userId = 'test-user';
      component.token = 'test-token';
      component.resetForm.get('password')?.setValue('1234567890');
      component.resetForm.get('confirmPassword')?.setValue('1234567890');
      component.submit();
      expect(authService.resetPassword).toHaveBeenCalledWith({
        UserId: 'test-user',
        Token: 'test-token',
        NewPassword: '1234567890'
      });
      expect(snack.open).toHaveBeenCalledWith('Password reset successful. Please login.', 'Close', { duration: 3000 });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show snack on error', () => {
      authService.resetPassword = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
      component.userId = 'test-user';
      component.token = 'test-token';
      component.resetForm.get('password')?.setValue('1234567890');
      component.resetForm.get('confirmPassword')?.setValue('1234567890');
      component.submit();
      expect(snack.open).toHaveBeenCalledWith('Failed to reset password', 'Close', { duration: 3000 });
    });
  });
});
