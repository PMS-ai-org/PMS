import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppointmentComponent } from './appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PatientAutocompleteComponent } from '../patient-autocomplete/patient-autocomplete.component';
import { RepositoryService } from '../../services/repository.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  // mocks
  const mockAppointmentService = {
    getByPatient: () => of([]),
    create: () => of({}),
    update: () => of({}),
    delete: () => of({})
  };
  const mockRepositoryService = {
    getUsers: () => of([]),
    getClinics: () => of([]),
    getAppointments: () => of([])
  };
  const mockAuthSessionService = {
    session: () => ({ role: 'user' })
  };
  const mockPatientService = {
    loadPatientById: (id: string) => {},
    patients$: of({ full_name: 'Test Patient' })
  };
  const mockToastService = {
    success: (msg: string) => {}
  };
  const mockRouter = {
    navigate: (commands: any[], extras?: any) => {}
  };
  const mockChangeDetectorRef = {
    detectChanges: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppointmentComponent,
        ReactiveFormsModule,
        CommonModule,
        PatientAutocompleteComponent
      ],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: RepositoryService, useValue: mockRepositoryService },
        { provide: AuthSessionService, useValue: mockAuthSessionService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => ''
            }),
            queryParams: of({ mode: 'view' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    component.patientId = '123';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});