import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PatientRegistrationComponent } from './patient-registration.component';
import { PatientService } from '../../services/patient.service';
import { MaterialModule } from '../../core/shared/material.module';
import { Patient } from '../../models/patient.model';

class MockPatientService {
  loadPatientById = jest.fn();
  savePatient = jest.fn();
  patients$ = new BehaviorSubject<Patient | null>(null).asObservable();
}

class MockRouter {
  navigate = jest.fn();
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn().mockReturnValue(null)
    }
  };
}

describe('PatientRegistrationComponent', () => {
  let component: PatientRegistrationComponent;
  let fixture: ComponentFixture<PatientRegistrationComponent>;
  let mockPatientService: MockPatientService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;
  let patientsSubject: BehaviorSubject<Patient | null>;

  beforeEach(async () => {
    patientsSubject = new BehaviorSubject<Patient | null>(null);

    mockPatientService = new MockPatientService();
    mockPatientService.patients$ = patientsSubject.asObservable();

    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [
        PatientRegistrationComponent,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: mockPatientService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create the form with all controls', () => {
      expect(component.form.contains('firstName')).toBeTruthy();
      expect(component.form.contains('lastName')).toBeTruthy();
      expect(component.form.contains('dateOfBirth')).toBeTruthy();
      // expect(component.form.contains('age')).toBeTruthy();
      expect(component.form.contains('gender')).toBeTruthy();
      expect(component.form.contains('phone')).toBeTruthy();
      expect(component.form.contains('email')).toBeTruthy();
      // expect(component.form.contains('address')).toBeTruthy();
      expect(component.form.contains('bloodGroup')).toBeTruthy();
      expect(component.form.contains('allergies')).toBeTruthy();
      expect(component.form.contains('conditions')).toBeTruthy();
      expect(component.form.contains('medications')).toBeTruthy();
      expect(component.form.contains('notes')).toBeTruthy();
    });
  });

  describe('First Name Validation', () => {
    it('should be invalid if less than 3 characters', () => {
      const control = component.form.get('firstName');
      control?.setValue('As');
      expect(control?.valid).toBeFalsy();
    });
    it('should be valid if 3 or more characters', () => {
      const control = component.form.get('firstName');
      control?.setValue('Ash');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('Last Name Validation', () => {
    it('should be invalid if less than 3 characters', () => {
      const control = component.form.get('lastName');
      control?.setValue('Mo');
      expect(control?.valid).toBeFalsy();
    });
    it('should be valid if 3 or more characters', () => {
      const control = component.form.get('lastName');
      control?.setValue('Moe');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('Phone Number Validation', () => {
    it('should be invalid if not 10 digits', () => {
      const control = component.form.get('phone');
      control?.setValue('12345');
      expect(control?.valid).toBeFalsy();
    });

    it('should be valid if exactly 10 digits', () => {
      const control = component.form.get('phone');
      control?.setValue('9876543210');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('Email Validation', () => {
    it('should be invalid if email format is wrong', () => {
      const control = component.form.get('email');
      control?.setValue('wrongEmail');
      expect(control?.valid).toBeFalsy();
    });

    it('should be valid if email format is correct', () => {
      const control = component.form.get('email');
      control?.setValue('test@example.com');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('calculateAge', () => {
    it('should set calculatedAge to 0 if dateOfBirth is not set', () => {
      component.form.get('dateOfBirth')?.setValue('');
      component.calculateAge();
      expect(component.calculatedAge).toBe(0);
    });

    it('should calculate correct age if dateOfBirth is set', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 25);
      component.form.get('dateOfBirth')?.setValue(dob);
      component.calculateAge();
      expect(component.calculatedAge).toBe(25);
    });
  });

  describe('onCancel', () => {
    it('should reset the form', () => {
      component.form.get('firstName')?.setValue('John');
      component.onCancel(true);
      expect(component.form.get('firstName')?.value).toBe("");
    });
  });

  describe('onSubmit', () => {
    it('should call markAllAsTouched if form is invalid', () => {
      const spy = jest.spyOn(component.form, 'markAllAsTouched');
      component.onSubmit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call patientService.createPatient if form is valid', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date(),
        gender: 'Male',
        phone: '9876543210',
        email: 'test@example.com',
        address: '123 Main St',
        bloodGroup: 'A+',
        allergies: [],
        conditions: [],
        medications: [],
        notes: ''
      });
      component.calculatedAge = 30;
      component.patientId = '123';
      component.onSubmit();
      expect(mockPatientService.savePatient).toHaveBeenCalled();
    });
  });

  describe('mapPatientRecord', () => {
    it('should map form group to Patient object', () => {
      component.form.patchValue({
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2000-01-01',
        gender: 'Female',
        phone: '1234567890',
        email: 'jane@example.com',
        address: '456 Main St',
        conditions: ['Asthma'],
        medications: ['Aspirin'],
        notes: 'Test notes'
      });
      component.calculatedAge = 24;
      const patient = component.mapPatientRecord(component.form);
      expect(patient.full_name).toBe('Jane Smith');
      expect(patient.dob).toBe('2000-01-01');
      expect(patient.gender).toBe('Female');
      expect(patient.phone).toBe('1234567890');
      expect(patient.email).toBe('jane@example.com');
      expect(patient.address).toBe("");
      expect(patient.age).toBe(24);
      expect(patient.conditions).toEqual(['Asthma']);
      expect(patient.medications).toEqual(['Aspirin']);
      expect(patient.notes).toBe('Test notes');
    });
  });

  describe('ngOnInit', () => {
    it('should call loadPatientById and subscribe if patientId exists', () => {
      const patient: Patient = {
        full_name: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        phone: '1234567890',
        email: 'john@example.com',
        address: '789 Main St',
        age: 34,
        conditions: ['Diabetes'],
        medications: ['Metformin'],
        notes: 'Some notes'
      };
      mockActivatedRoute.snapshot.paramMap.get = jest.fn().mockReturnValue('123');
      fixture = TestBed.createComponent(PatientRegistrationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      patientsSubject.next(patient);

      expect(mockPatientService.loadPatientById).toHaveBeenCalledWith('123');
      expect(component.form.get('firstName')?.value).toBe('John');
      expect(component.form.get('lastName')?.value).toBe('Doe');
      expect(component.form.get('dateOfBirth')?.value).toBe('1990-01-01');
      expect(component.form.get('gender')?.value).toBe('Male');
      expect(component.form.get('phone')?.value).toBe('1234567890');
      expect(component.form.get('email')?.value).toBe('john@example.com');
      expect(component.form.get('address')?.value).toBe(undefined);
      expect(component.form.get('age')?.value).toBe(34);
      expect(component.form.get('conditions')?.value).toEqual(['Diabetes']);
      expect(component.form.get('medications')?.value).toEqual(['Metformin']);
      expect(component.form.get('notes')?.value).toBe('Some notes');
      expect(component.calculatedAge).toBe(34);
    });
  });
});
