import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HospedesService, Hospede } from '../../core/service/hospedes.service';

@Component({
  selector: 'app-hospedes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2 class="title">Hóspedes</h2>

      <div class="filtro">
        <input type="text" [(ngModel)]="filtro" placeholder="Nome, Documento ou Telefone" />
        <button class="btn primary" (click)="buscar()">Buscar</button>
        <button class="btn warn" (click)="limpar()">Limpar</button>
      </div>

      <div class="cards">
        <div *ngFor="let h of hospedesFiltrados" class="card-hospede">
          <p><strong>Nome:</strong> {{ h.nome }}</p>
          <p><strong>Documento:</strong> {{ h.documento }}</p>
          <p><strong>Telefone:</strong> {{ h.telefone }}</p>
          <p><strong>Carro:</strong> {{ h.possuiCarro ? 'Sim' : 'Não' }}</p>
        </div>
      </div>

      <p *ngIf="hospedesFiltrados.length === 0" class="vazio">
        Nenhum hóspede encontrado.
      </p>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 24px auto;
      padding: 16px;
      font-family: Arial, sans-serif;
      color: #333;
    }

    .title {
      text-align: center;
      font-size: 24px;
      margin-bottom: 24px;
      color: #1976d2;
    }

    .filtro {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 20px;
    }

    .filtro input {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      min-width: 220px;
      flex: 1 1 220px;
      transition: border-color 0.2s;
    }

    .filtro input:focus {
      border-color: #1976d2;
      outline: none;
    }

    .btn {
      padding: 8px 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      transition: opacity 0.2s;
    }

    .btn.primary { background-color: #1976d2; }
    .btn.warn { background-color: #d32f2f; }
    .btn:hover { opacity: 0.85; }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }

    .card-hospede {
      padding: 14px;
      border-radius: 8px;
      background: white;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card-hospede p {
      margin: 6px 0;
      font-size: 14px;
    }

    .card-hospede:hover {
      transform: translateY(-2px);
      box-shadow: 4px 4px 12px rgba(0,0,0,0.12);
    }

    .vazio {
      text-align: center;
      color: #666;
      margin-top: 24px;
      font-style: italic;
    }
  `]
})
export class HospedesComponent implements OnInit {
  filtro = '';
  hospedes: Hospede[] = [];
  hospedesFiltrados: Hospede[] = [];

  constructor(private hospedesSvc: HospedesService) {}

  ngOnInit() {
    this.hospedesSvc.listar().pipe(
      tap(res => {
        this.hospedes = res;
        this.hospedesFiltrados = this.hospedes;
      }),
      catchError(err => {
        console.error('Erro ao carregar hóspedes:', err);
        return of([]);
      })
    ).subscribe();
  }

  buscar() {
    const termo = this.filtro.trim().toLowerCase();
    this.hospedesFiltrados = termo
      ? this.hospedes.filter(h =>
          h.nome?.toLowerCase().includes(termo) ||
          h.documento?.toLowerCase().includes(termo) ||
          h.telefone?.toLowerCase().includes(termo)
        )
      : this.hospedes;
  }
  
  limpar() {
    this.filtro = '';
    this.hospedesFiltrados = this.hospedes;
  }
}
