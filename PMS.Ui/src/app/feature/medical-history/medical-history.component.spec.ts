import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { MedicalHistoryComponent } from './medical-history.component';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MaterialModule } from '../../core/shared/material.module';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

class MockMedicalHistoryService {
  getByPatient = jest.fn().mockReturnValue(of([]));
  create = jest.fn().mockReturnValue(of({}));
  update = jest.fn().mockReturnValue(of({}));
  delete = jest.fn().mockReturnValue(of({}));
}

describe('MedicalHistoryComponent', () => {
  let component: MedicalHistoryComponent;
  let fixture: ComponentFixture<MedicalHistoryComponent>;
  let service: MockMedicalHistoryService;

  beforeEach(async () => {
    service = new MockMedicalHistoryService();

    await TestBed.configureTestingModule({
      imports: [MedicalHistoryComponent, ReactiveFormsModule, MaterialModule, CommonModule],
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '' }) // mock route params
          }
        },
        FormBuilder,
        { provide: MedicalHistoryService, useValue: service },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('ngOnInit', () => {
  //   it('should call loadHistory if patientId is set', () => {
  //     const spy = jest.spyOn(component, 'loadHistory');
  //     component.patientId = '123';
  //     component.ngOnInit();
  //     expect(spy).toHaveBeenCalled();
  //   });

  //   it('should not call loadHistory if patientId is not set', () => {
  //     const spy = jest.spyOn(component, 'loadHistory');
  //     component.patientId = '';
  //     component.ngOnInit();
  //     expect(spy).not.toHaveBeenCalled();
  //   });
  // });

  // describe('loadHistory', () => {
  //   it('should load history list from service', () => {
  //     const mockList: MedicalHistory[] = [{
  //       id: '1',
  //       code: 'A',
  //       description: 'desc',
  //       patientId: '123',
  //       createdAt: 'now',
  //       source: '',
  //       clinicId: '',
  //       siteId: '',
  //       created_by: '',
  //       updated_at: '',
  //       updated_by: ''
  //     }];
  //     service.getByPatient = jest.fn().mockReturnValue(of(mockList));
  //     component.patientId = '123';
  //     component.loadHistory();
  //     expect(service.getByPatient).toHaveBeenCalledWith('123');
  //     expect(component.historyList).toEqual(mockList);
  //   });
  // });

  // describe('onSubmit', () => {
  //   it('should create new entry if not editing', () => {
  //     const spyCreate = jest.spyOn(service, 'create').mockReturnValue(of({}));
  //     const spyLoad = jest.spyOn(component, 'loadHistory');
  //     component.historyForm.patchValue({
  //       code: 'A',
  //       description: 'desc',
  //       source: '',
  //       clinicId: '',
  //       siteId: ''
  //     });
  //     component.editingId = undefined;
  //     component.onSubmit();
  //     expect(spyCreate).toHaveBeenCalled();
  //     expect(component.historyForm.value.code).toBe(''); // form reset
  //     expect(spyLoad).toHaveBeenCalled();
  //   });

  //   it('should handle error on create', () => {
  //     jest.spyOn(service, 'create').mockReturnValue(throwError(() => ({ message: 'fail' })));
  //     component.historyForm.patchValue({
  //       code: 'A',
  //       description: 'desc',
  //       source: '',
  //       clinicId: '',
  //       siteId: ''
  //     });
  //     component.editingId = undefined;
  //     component.onSubmit();
  //     expect(component.error).toBe('fail');
  //   });

  //   it('should update entry if editingId is set', () => {
  //     const spyUpdate = jest.spyOn(service, 'update').mockReturnValue(of({}));
  //     const spyLoad = jest.spyOn(component, 'loadHistory');
  //     component.editingId = '1';
  //     component.historyForm.patchValue({
  //       code: 'A',
  //       description: 'desc',
  //       source: '',
  //       clinicId: '',
  //       siteId: ''
  //     });
  //     component.onSubmit();
  //     expect(spyUpdate).toHaveBeenCalledWith('1', expect.objectContaining({ code: 'A' }));
  //     expect(component.editingId).toBeUndefined();
  //     expect(component.historyForm.value.code).toBe(''); // form reset
  //     expect(spyLoad).toHaveBeenCalled();
  //   });

  //   it('should handle error on update', () => {
  //     jest.spyOn(service, 'update').mockReturnValue(throwError(() => ({ message: 'fail' })));
  //     component.editingId = '1';
  //     component.historyForm.patchValue({
  //       code: 'A',
  //       description: 'desc',
  //       source: '',
  //       clinicId: '',
  //       siteId: ''
  //     });
  //     component.onSubmit();
  //     expect(component.error).toBe('fail');
  //   });
  // });

  // describe('edit', () => {
  //   it('should set editingId and patch form', () => {
  //     const entry: MedicalHistory = {
  //       id: '1',
  //       code: 'A',
  //       description: 'desc',
  //       patientId: '123',
  //       createdAt: 'now',
  //       source: '',
  //       clinicId: '',
  //       siteId: '',
  //       created_by: '',
  //       updated_at: '',
  //       updated_by: ''
  //     };
  //     component.edit(entry);
  //     expect(component.editingId).toBe('1');
  //     expect(component.historyForm.value.code).toBe('A');
  //   });
  // });

  // describe('delete', () => {
  //   it('should call delete and reload history', () => {
  //     const spyDelete = jest.spyOn(service, 'delete').mockReturnValue(of({}));
  //     const spyLoad = jest.spyOn(component, 'loadHistory');
  //     component.delete('1');
  //     expect(spyDelete).toHaveBeenCalledWith('1');
  //     expect(spyLoad).toHaveBeenCalled();
  //   });
  // });
});