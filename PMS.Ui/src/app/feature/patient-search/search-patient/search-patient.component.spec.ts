import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPatientComponent } from './search-patient.component';

describe('SearchPatient', () => {
  let component: SearchPatientComponent;
  let fixture: ComponentFixture<SearchPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
