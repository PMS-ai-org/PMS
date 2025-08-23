import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SearchPatientService } from './search-patient.service';

describe('SearchPatientService (standalone style)', () => {
  let service: SearchPatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(),   
      ],
    });
    service = TestBed.inject(SearchPatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should call API', () => {
    service.searchPatients('a').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/api/Patients/search'));
    expect(req.request.method).toBe('GET');
    req.flush({ total: 0, items: [] });
  });
});
