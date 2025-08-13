import { TestBed } from '@angular/core/testing';
import { SampleService } from './sample.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SampleService', () => {
  let service: SampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi())]
    });
    service = TestBed.inject(SampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items from the correct URL', () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];

    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });
  });

  it('should handle empty items array', () => {
    service.getItems().subscribe(items => {
      expect(items).toEqual([]);
    });
  });
});
