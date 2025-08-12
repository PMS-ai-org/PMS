import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'pms-home',
  imports: [ReactiveFormsModule, NgOptimizedImage],
  template: `
    <section>
      <h2>Welcome to PMS UI</h2>
      <p>Clicks: {{ count() }}</p>
      <button type="button" (click)="inc()">Increment</button>

      <form>
        <label>Name: <input [formControl]="nameControl" /></label>
      </form>

      <p *@if(nameControl.value)>Hello, {{ nameControl.value }}</p>

      <img ngSrc="/assets/logo.png" width="120" height="40" alt="logo" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'pms-home' }
})
export class HomeComponent {
  private _count = signal(0);
  readonly count = this._count.asReadonly();

  nameControl = new FormControl('');

  readonly nameLength = computed(() => this.nameControl.value ? String(this.nameControl.value).length : 0);

  inc() { this._count.update(c => c + 1); }
}
