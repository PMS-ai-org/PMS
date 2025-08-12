import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'pms-feature',
  imports: [CommonModule],
  template: `
    <section>
      <h2>Feature (lazy)</h2>
      <p>Status: {{ status() }}</p>
      <button (click)="refresh()">Refresh</button>
      <ul><li @for="let item of data()">{{ item.name }}</li></ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'pms-feature' }
})
export class FeatureComponent {
  private http = inject(HttpClient);
  private _data = signal<{ id:number; name:string }[]>([]);
  readonly data = this._data.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  readonly status = computed(() => this.loading() ? 'Loading...' : `${this.data().length} items`);

  refresh() {
    this._loading.set(true);
    setTimeout(() => {
      this._data.set([{ id:1, name:'Alpha' }, { id:2, name:'Beta' }]);
      this._loading.set(false);
    }, 400);
  }
}
