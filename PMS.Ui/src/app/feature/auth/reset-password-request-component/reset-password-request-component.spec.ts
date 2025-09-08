
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResetPasswordRequestComponent } from './reset-password-request-component';
import { ClinicService } from '../../../core/auth/clinic.service';

describe('ResetPasswordRequestComponent', () => {
  let component: ResetPasswordRequestComponent;
  let fixture: ComponentFixture<ResetPasswordRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordRequestComponent, HttpClientTestingModule],
      providers: [ClinicService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
