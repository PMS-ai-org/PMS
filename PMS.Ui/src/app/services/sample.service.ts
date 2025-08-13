import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SampleService {

  constructor(private httpClient: HttpClient) {}
  getItems() {
    return this.httpClient.get<{ id:number; name:string }[]>('/assets/data/items.json');
  }
}
