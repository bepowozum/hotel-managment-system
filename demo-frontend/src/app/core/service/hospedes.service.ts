// src/app/core/service/hospedes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hospede {
  id?: number;
  nome: string;
  documento: string;
  telefone: string;
  possuiCarro: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HospedesService {
  private baseUrl = '/api/hospedes';  // usa proxy
  // private baseUrl = '/api/hospedes'; 

  constructor(private http: HttpClient) {}

  listar(): Observable<Hospede[]> {
    return this.http.get<Hospede[]>(this.baseUrl);
  }

  getById(id: number): Observable<Hospede> {
    return this.http.get<Hospede>(`${this.baseUrl}/${id}`);
  }

  criar(h: Hospede): Observable<Hospede> {
    return this.http.post<Hospede>(this.baseUrl, h);
  }

  // atualizar(id: number, h: Hospede): Observable<Hospede> {
  //   return this.http.put<Hospede>(`${this.baseUrl}/${id}`, h);
  // }

  // deletar(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/${id}`);
  // }

  buscar(termo: string): Observable<Hospede[]> {
  return this.http.get<Hospede[]>(`${this.baseUrl}?filtro=${encodeURIComponent(termo)}`);
}
}
