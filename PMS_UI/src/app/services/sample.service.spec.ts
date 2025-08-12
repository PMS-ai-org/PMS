import { SampleService } from './services/sample.service';

describe('SampleService', () => {
  it('exists', () => {
    const svc = new SampleService();
    expect(svc).toBeTruthy();
  });
});
