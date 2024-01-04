import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  get(dataUrl: string) {
    return this.http
    .get<any>(dataUrl);
  }
}
