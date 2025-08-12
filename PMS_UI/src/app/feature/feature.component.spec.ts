import { FeatureComponent } from './feature.component';

describe('FeatureComponent', () => {
  jest.useFakeTimers();
  it('refresh loads items', () => {
    const cmp = new FeatureComponent();
    cmp.refresh();
    jest.advanceTimersByTime(500);
    expect(cmp['data']().length).toBeGreaterThan(0);
  });
});
