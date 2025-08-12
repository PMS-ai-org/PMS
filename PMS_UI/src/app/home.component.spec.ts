import { HomeComponent } from './home.component';
import { FormControl } from '@angular/forms';

describe('HomeComponent', () => {
  it('increments count', () => {
    const cmp = new HomeComponent();
    expect(cmp['count']()).toBe(0);
    cmp.inc();
    expect(cmp['count']()).toBe(1);
  });

  it('name control works', () => {
    const cmp = new HomeComponent();
    cmp.nameControl.setValue('Swapnil');
    expect(cmp.nameControl.value).toBe('Swapnil');
  });
});
