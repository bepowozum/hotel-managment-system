import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <- necessário para ngIf, ngFor e pipe number
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ReservaService, Reserva } from '../../core/service/reserva.service';

@Component({
  selector: 'app-reservas-list',
  standalone: true, // <-- continue como standalone
  imports: [CommonModule], // <-- adiciona aqui
  template: `
    <h2>Reservas</h2>
    <div *ngIf="reservas$ | async as reservas; else carregando">
      <table *ngIf="reservas.length; else vazio">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hóspede</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservas; trackBy: trackById">
            <td>{{ r.id }}</td>
            <td>{{ r.hospede.nome }}</td>
            <td>{{ r.dataCheckin }} {{ r.horaCheckin || '' }}</td>
            <td>{{ r.dataCheckout }} {{ r.horaCheckout || '' }}</td>
            <td>{{ r.status }}</td>
            <td>R$ {{ r.valorTotal | number:'1.2-2' }}</td>
            <td>
              <button (click)="doCheckin(r.id)" [disabled]="r.status !== 'RESERVADO'">Check-in</button>
              <button (click)="doCheckout(r.id)" [disabled]="r.status !== 'CHECKED_IN'">Check-out</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #carregando>Carregando...</ng-template>
    <ng-template #vazio>Nenhuma reserva.</ng-template>
  `
})
export class ReservasListComponent implements OnInit {
  reservas$!: Observable<Reserva[]>;

  constructor(private svc: ReservaService) {}

  ngOnInit() {
    this.reservas$ = this.svc.listar().pipe(
      tap(res => console.log('Reservas recebidas do backend:', res)),
      catchError(err => {
        console.error('Erro ao listar reservas:', err);
        return of([]);
      })
    );
  }

  trackById = (_: number, item: Reserva) => item.id;

  doCheckin(id?: number | null) {
    if (!id) return;
    this.svc.checkin(id).subscribe({
      next: () => this.reservas$ = this.svc.listar(),
      error: err => alert('Erro no check-in: ' + (err?.error?.message || err?.message || 'Erro desconhecido'))
    });
  }

  doCheckout(id?: number | null) {
    if (!id) return;
    this.svc.checkout(id).subscribe({
      next: () => this.reservas$ = this.svc.listar(),
      error: err => alert('Erro no check-out: ' + (err?.message || err))
    });
  }
}
