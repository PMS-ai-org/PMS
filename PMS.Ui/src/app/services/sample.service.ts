import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SampleService {
  private http = inject(HttpClient);

  getItems() {
    return this.http.get<{ id:number; name:string }[]>('/assets/data/items.json');
  }
}
