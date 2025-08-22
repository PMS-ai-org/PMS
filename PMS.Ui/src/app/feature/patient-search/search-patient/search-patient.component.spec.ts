import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SearchPatientComponent } from './search-patient.component';
import { SearchPatientResponse } from '../../../services/search-patient.service';

xdescribe('SearchPatientComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPatientComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

//  it('should call API when typing a query', () => {
//   const fixture = TestBed.createComponent(SearchPatientComponent);
//   const comp = fixture.componentInstance;

//   comp.minLength = 1;
//   comp.debounceMs = 0;      
//   fixture.detectChanges();  

//   comp.q.setValue('a');     
//   fixture.detectChanges();

//   const req = httpMock.expectOne(r =>
//     r.url.endsWith('/api/search/patients') &&
//     r.method === 'GET' &&
//     r.params.get('q') === 'a'
//   );

//   req.flush({ total: 0, items: [] });
// });
it('debug: log outgoing requests', fakeAsync(() => {
  const fixture = TestBed.createComponent(SearchPatientComponent);
  const comp = fixture.componentInstance;
  comp.minLength = 1;
  comp.debounceMs = 0;
  fixture.detectChanges();

  comp.q.setValue('a');
  fixture.detectChanges();
  tick(0);

  const all = httpMock.match(() => true);
  console.log('Requests:', all.map(r => r.request.urlWithParams)); // check exact URL+params
  all.forEach(r => r.flush({ total: 0, items: [] } as SearchPatientResponse));
}));
});
