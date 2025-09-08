import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../services/loader.service';
import { ClinicService } from '../../../core/auth/clinic.service';
import { CreateDoctorComponent } from './create-doctor.component';

class MockClinicService {
  getClinics = jest.fn().mockReturnValue(of([{ id: '1', name: 'Clinic 1' }]));
  getRoles = jest.fn().mockReturnValue(of([{ roleId: 'r1', roleName: 'Doctor' }]));
  getFeatures = jest.fn().mockReturnValue(of([{ featureId: 'f1', featureName: 'Feature 1' }]));
  getSitesByClinic = jest.fn().mockReturnValue(of([{ id: 's1', name: 'Site 1' }]));
  saveDoctor = jest.fn().mockReturnValue(of({}));
}

class MockLoaderService {
  show = jest.fn();
  hide = jest.fn();
}

class MockRouter {
  navigate = jest.fn();
}

class MockSnackBar {
  open = jest.fn();
}

describe('CreateDoctorComponent', () => {
  let component: CreateDoctorComponent;
  let fixture: ComponentFixture<CreateDoctorComponent>;
  let clinicService: MockClinicService;
  let loader: MockLoaderService;
  let router: MockRouter;
  let snack: MockSnackBar;

  beforeEach(async () => {
    clinicService = new MockClinicService();
    loader = new MockLoaderService();
    router = new MockRouter();
    snack = new MockSnackBar();

    await TestBed.configureTestingModule({
      imports: [CreateDoctorComponent, ReactiveFormsModule],
      providers: [
        { provide: ClinicService, useValue: clinicService },
        { provide: LoaderService, useValue: loader },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snack }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize doctorForm', () => {
      expect(component.doctorForm).toBeDefined();
      expect(component.doctorForm.get('email')).toBeDefined();
      expect(component.doctorForm.get('fullName')).toBeDefined();
      expect(component.doctorForm.get('phoneNumber')).toBeDefined();
      expect(component.doctorForm.get('specialization')).toBeDefined();
      expect(component.doctorForm.get('roleId')).toBeDefined();
      expect(component.doctorForm.get('clinicId')).toBeDefined();
      expect(component.doctorForm.get('sites')).toBeDefined();
    });

    it('should load master data', () => {
      expect(clinicService.getClinics).toHaveBeenCalled();
      expect(clinicService.getRoles).toHaveBeenCalled();
      expect(clinicService.getFeatures).toHaveBeenCalled();
      expect(component.clinics.length).toBeGreaterThan(0);
      expect(component.roles.length).toBeGreaterThan(0);
      expect(component.features.length).toBeGreaterThan(0);
    });
  });

  xdescribe('loadMasterData', () => {
    it('should handle error in loadMasterData', () => {
      clinicService.getClinics = jest.fn().mockReturnValue(throwError(() => ({ error: { message: 'fail' } })));
      clinicService.getRoles = jest.fn().mockReturnValue(of([]));
      clinicService.getFeatures = jest.fn().mockReturnValue(of([]));
      component.loadMasterData();
      expect(snack.open).toHaveBeenCalledWith(
        'Failed to load data. Please try again later.fail',
        'Close',
        { duration: 3000 }
      );
    });
  });

  describe('onRoleChange', () => {
    it('should update roleText onRoleChange', () => {
      component.roles = [{ roleId: 'r1', roleName: 'Doctor' }];
      component.onRoleChange('r1');
      expect(component.roleText).toBe('Doctor');
      component.onRoleChange('notfound');
      expect(component.roleText).toBe('');
    });
  });

  describe('onClinicChange', () => {
    it('should update sites onClinicChange', () => {
      component.onClinicChange('1');
      expect(clinicService.getSitesByClinic).toHaveBeenCalledWith('1');
      expect(component.sites.length).toBeGreaterThan(0);
    });
  });

  describe('onSitesChange', () => {
    it('should update sitesFormArray on onSitesChange', () => {
      component.sites = [{ id: 's1', name: 'Site 1' }];
      component.features = [{ featureId: 'f1', featureName: 'Feature 1' }];
      component.onSitesChange(['s1']);
      expect(component.sitesFormArray.length).toBe(1);
      const siteGroup = component.sitesFormArray.at(0) as FormGroup;
      expect(siteGroup.get('siteId')?.value).toBe('s1');
      expect(siteGroup.get('siteName')?.value).toBe('Site 1');
      expect((siteGroup.get('features') as FormArray).length).toBe(1);
    });
  });

  describe('sitesDataSource', () => {
    it('should return sitesDataSource', () => {
      component.sites = [{ id: 's1', name: 'Site 1' }];
      component.features = [{ featureId: 'f1', featureName: 'Feature 1' }];
      component.onSitesChange(['s1']);
      expect(component.sitesDataSource.length).toBe(1);
    });
  });

  describe('onSubmit', () => {
    it('should call loader.show and saveDoctor on valid submit', () => {
      component.doctorForm.patchValue({
        email: 'test@doc.com',
        fullName: 'Doc',
        phoneNumber: '1234567890',
        specialization: 'Cardio',
        roleId: 'r1',
        clinicId: '1'
      });
      component.sites = [{ id: 's1', name: 'Site 1' }];
      component.features = [{ featureId: 'f1', featureName: 'Feature 1' }];
      component.onSitesChange(['s1']);
      component.doctorForm.markAllAsTouched();
      component.onSubmit();
      expect(loader.show).toHaveBeenCalled();
      expect(clinicService.saveDoctor).toHaveBeenCalled();
    });

    xit('should handle error on saveDoctor', () => {
      clinicService.saveDoctor = jest.fn().mockReturnValue(throwError(() => ({ error: { message: 'fail' } })));
      component.doctorForm.patchValue({
        email: 'test@doc.com',
        fullName: 'Doc',
        phoneNumber: '1234567890',
        specialization: 'Cardio',
        roleId: 'r1',
        clinicId: '1'
      });
      component.sites = [{ id: 's1', name: 'Site 1' }];
      component.features = [{ featureId: 'f1', featureName: 'Feature 1' }];
      component.onSitesChange(['s1']);
      component.doctorForm.markAllAsTouched();
      component.onSubmit();
      expect(snack.open).toHaveBeenCalledWith(
        'Error: fail',
        'Close',
        { duration: 3000 }
      );
      expect(loader.hide).toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      component.doctorForm.patchValue({
        email: '',
        fullName: '',
        phoneNumber: '',
        specialization: '',
        roleId: '',
        clinicId: ''
      });
      component.onSubmit();
      expect(loader.show).not.toHaveBeenCalled();
      expect(clinicService.saveDoctor).not.toHaveBeenCalled();
    });
  });
});
