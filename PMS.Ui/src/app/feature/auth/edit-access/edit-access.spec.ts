import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccess } from './edit-access';

describe('EditAccess', () => {
  let component: EditAccess;
  let fixture: ComponentFixture<EditAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccess]
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
