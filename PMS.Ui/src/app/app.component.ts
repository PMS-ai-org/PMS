import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pms-root',
  imports: [RouterOutlet],
  template: `
   <header role="banner">
      <h1>PMS UI</h1>
   </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header { padding: 1rem; background: var(--primary); color: white; }
    main { padding: 1rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'pms-root' }
})
export class AppComponent {
  private _count = signal(0);
  readonly count = this._count.asReadonly();

  increment() { this._count.update(c => c + 1); }
}
