import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalHistoryComponent } from './medical-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { of } from 'rxjs';

describe('MedicalHistoryComponent', () => {
  let component: MedicalHistoryComponent;
  let fixture: ComponentFixture<MedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalHistoryComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MedicalHistoryService, useValue: {
          getByPatient: () => of([]),
          create: () => of({}),
          update: () => of({}),
          delete: () => of({})
        } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalHistoryComponent);
    component = fixture.componentInstance;
    component.patientId = '123';
    fixture.detectChanges();
  });

  it('should create and load history', () => {
    expect(component).toBeTruthy();
    expect(component.historyList).toBeDefined();
  });
});