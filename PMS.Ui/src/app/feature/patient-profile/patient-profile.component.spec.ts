import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientProfileComponent } from './patient-profile.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientService } from '../../services/patient.service';

describe('PatientProfileComponent', () => {
  let component: PatientProfileComponent;
  let fixture: ComponentFixture<PatientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientProfileComponent],
      providers: [
        {
          provide: PatientService,
          useValue: { getById: () => of({ fullName: 'Test Patient' }) }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load patient', () => {
    expect(component).toBeTruthy();
    expect(component.patient?.fullName).toEqual('Test Patient');
  });
});