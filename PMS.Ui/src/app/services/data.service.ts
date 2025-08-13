import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private _cache = signal<Record<string, unknown> | null>(null);
  readonly cache = this._cache.asReadonly();


  getSomeData() {
    // returns mock promise; in real app return observable
    return Promise.resolve({ ok: true });
  }

  setCache(value: Record<string, unknown>) {
    this._cache.set(value);
  }
}
