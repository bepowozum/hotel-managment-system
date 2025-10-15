// src/app/components/reserva-form/reserva-form.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService, Reserva } from '../../core/service/reserva.service';
import { Hospede } from '../../core/service/hospedes.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container" *ngIf="hospede">
      <h2>Nova Reserva</h2>

      <div class="hospede-info">
        <div><strong>Nome:</strong> {{ hospede.nome }}</div>
        <div><strong>Documento:</strong> {{ hospede.documento }}</div>
        <div><strong>Telefone:</strong> {{ hospede.telefone }}</div>
        <div><strong>Possui carro:</strong> {{ hospede.possuiCarro ? 'Sim' : 'Não' }}</div>
      </div>

      <form (ngSubmit)="criarReserva()" #formReserva="ngForm" class="form">
        <label class="field">
          <span>Data de Entrada</span>
          <input
            type="date"
            name="entrada"
            required
            [(ngModel)]="dataEntrada"
            (change)="atualizarEstimativa()"
          />
        </label>

        <label class="field">
          <span>Data de Saída</span>
          <input
            type="date"
            name="saida"
            required
            [(ngModel)]="dataSaida"
            (change)="atualizarEstimativa()"
          />
        </label>

        <div *ngIf="valorEstimado !== null" class="estimativa">
          <div><strong>Valor estimado:</strong> R$ {{ valorEstimado | number:'1.2-2' }}</div>
          <div *ngIf="hospede.possuiCarro" class="nota">Inclui taxa de estacionamento (se aplicável).</div>
        </div>

        <div class="buttons">
          <button type="submit" class="btn" [disabled]="formReserva.invalid">Criar Reserva</button>
          <button type="button" class="btn secondary" (click)="limpar()">Limpar</button>
        </div>
      </form>

      <div *ngIf="mensagem" class="mensagem" [ngClass]="{'erro': mensagemErro, 'sucesso': !mensagemErro}">
        {{ mensagem }}
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      color: #333;
    }

    h2 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .hospede-info {
      margin-bottom: 16px;
      color: #444;
      display: grid;
      gap: 6px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      font-size: 14px;
    }

    .field span {
      margin-bottom: 6px;
      font-weight: 600;
    }

    input[type="date"] {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    input:focus {
      border-color: #1976d2;
      outline: none;
      box-shadow: 0 0 0 2px rgba(25,118,210,0.2);
    }

    .estimativa {
      background: #f7f9fb;
      padding: 10px;
      border-radius: 6px;
      font-weight: 600;
    }

    .nota {
      font-weight: 400;
      font-size: 13px;
      color: #666;
      margin-top: 6px;
    }

    .buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .btn {
      background: #0ea5a4;
      color: #fff;
      border: none;
      padding: 10px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn:hover:not(:disabled) {
      background: #0b8b89;
    }

    .btn.secondary {
      background: #f3f4f6;
      color: #111;
    }

    .mensagem {
      margin-top: 12px;
      font-weight: 600;
      text-align: center;
    }

    .mensagem.erro {
      color: #b91c1c;
    }

    .mensagem.sucesso {
      color: #15803d;
    }
  `]
})
export class ReservaFormComponent implements OnChanges {
  @Input() hospede!: Hospede;

  dataEntrada = '';
  dataSaida = '';
  valorEstimado: number | null = null;
  mensagem = '';
  mensagemErro = false;

  constructor(private reservaSvc: ReservaService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hospede']) {
      this.dataEntrada = '';
      this.dataSaida = '';
      this.valorEstimado = null;
      this.mensagem = '';
      this.mensagemErro = false;
    }
  }

  private calcularValorInterno(): number {
    if (!this.dataEntrada || !this.dataSaida) return 0;
    const entrada = new Date(this.dataEntrada);
    const saida = new Date(this.dataSaida);
    if (isNaN(entrada.getTime()) || isNaN(saida.getTime())) return 0;
    if (saida <= entrada) return 0;

    let total = 0;
    const diariaSemana = 120;
    const diariaFimSemana = 180;
    const taxaCarroSemana = 15;
    const taxaCarroFimSemana = 20;

    for (let d = new Date(entrada); d < saida; d.setDate(d.getDate() + 1)) {
      const dia = d.getDay();
      const ehFimSemana = dia === 0 || dia === 6;
      total += ehFimSemana ? diariaFimSemana : diariaSemana;
      if (this.hospede?.possuiCarro) {
        total += ehFimSemana ? taxaCarroFimSemana : taxaCarroSemana;
      }
    }
    return total;
  }

  atualizarEstimativa() {
    const v = this.calcularValorInterno();
    this.valorEstimado = v > 0 ? v : null;
  }

  limpar() {
    this.dataEntrada = '';
    this.dataSaida = '';
    this.valorEstimado = null;
    this.mensagem = '';
    this.mensagemErro = false;
  }

  criarReserva() {
    if (!this.hospede) return;
    if (!this.dataEntrada || !this.dataSaida) {
      this.mensagemErro = true;
      this.mensagem = 'Preencha entrada e saída.';
      return;
    }
    const entrada = new Date(this.dataEntrada);
    const saida = new Date(this.dataSaida);
    if (saida <= entrada) {
      this.mensagemErro = true;
      this.mensagem = 'Data de saída deve ser posterior à entrada.';
      return;
    }

    const valorCalculado = this.calcularValorInterno();

    const payload: Partial<Reserva> = {
      hospede: this.hospede as any,
      dataCheckin: this.dataEntrada,
      dataCheckout: this.dataSaida,
      horaCheckin: '14:00:00',
      horaCheckout: '12:00:00',
      status: 'RESERVADO',
      valorTotal: valorCalculado
    };

    this.reservaSvc.criar(payload)
      .pipe(
        tap((res) => {
          this.mensagemErro = false;
          this.mensagem = `Reserva criada com sucesso para ${this.hospede.nome}. Valor: R$ ${valorCalculado.toFixed(2)}`;
          this.dataEntrada = '';
          this.dataSaida = '';
          this.valorEstimado = null;
        }),
        catchError(err => {
          console.error('Erro ao criar reserva:', err);
          this.mensagemErro = true;
          this.mensagem = err?.error?.message || 'Erro ao criar reserva.';
          return of(null);
        })
      ).subscribe();
  }
}
