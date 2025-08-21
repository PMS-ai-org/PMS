import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientRegistrationComponent } from './patient-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('PatientRegistrationComponent', () => {
  let component: PatientRegistrationComponent;
  let fixture: ComponentFixture<PatientRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRegistrationComponent, ReactiveFormsModule, CommonModule],
      providers: [
        {
          provide: PatientService,
          useValue: {
            register: () => of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate registration form', () => {
    component.registrationForm.setValue({
      fullName: 'John Doe',
      dob: '1990-01-01',
      gender: 'male',
      phone: '1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      age: '30',
      conditions: [],
      medications: []
    });
expect(component.registrationForm.valid).toBe(true);
  });
});