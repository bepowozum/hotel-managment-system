// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Observable } from 'rxjs';

// export interface Item {
//   id: number;
//   name: string;
// }

// @Injectable({ providedIn: 'root' })
// export class ApiService {
//   private readonly baseUrl = environment.apiBaseUrl;

//   constructor(private http: HttpClient) {}

//   getHello(): Observable<string> {
//     return this.http.get(`${this.baseUrl}/hello`, { responseType: 'text' });
//   }

//   getItems(): Observable<Item[]> {
//     return this.http.get<Item[]>(`${this.baseUrl}/items`);
//   }
// }