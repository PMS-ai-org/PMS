import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      // Provide any required services or mocks here if needed
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });
});
