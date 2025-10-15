// src/app/core/service/reserva.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospede } from './hospedes.service';

export interface Reserva {
  id?: number;
  hospede: Hospede;
  dataCheckin: string; // "YYYY-MM-DD"
  horaCheckin?: string; // "HH:mm:ss" (opcional no POST)
  dataCheckout: string;
  horaCheckout?: string;
  status?: string;
  valorTotal?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = '/api/reservas';
  

  constructor(private http: HttpClient) {}

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  getById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${id}`);
  }

  criar(reserva: Partial<Reserva>): Observable<Reserva> {
    return this.http.post<Reserva>(this.baseUrl, reserva);
  }

  atualizar(id: number, reserva: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}`, reserva);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listarPorHospede(hospedeId: number) {
    return this.http.get<Reserva[]>(`${this.baseUrl}/hospede/${hospedeId}`);
  }

  listarPorStatus(status: string) {
    return this.http.get<Reserva[]>(`${this.baseUrl}/status/${encodeURIComponent(status)}`);
  }

    checkin(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/checkin/${id}`, {});
    }

checkout(id: number, body?: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/checkout/${id}`, body || {});
}
}
