import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EditAccess } from './edit-access.component';
import { ClinicService } from '../../../core/auth/clinic.service';

describe('EditAccess', () => {
  let component: EditAccess;
  let fixture: ComponentFixture<EditAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccess, HttpClientTestingModule],
      providers: [ClinicService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
