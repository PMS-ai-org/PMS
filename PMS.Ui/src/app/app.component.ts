import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'pms-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'pms-root' }
})
export class AppComponent {
  private _count = signal(0);
  readonly count = this._count.asReadonly();

  increment() { this._count.update(c => c + 1); }
}
