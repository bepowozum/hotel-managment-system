// src/app/features/reservas/checkin-checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService, Reserva } from '../../core/service/reserva.service';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-checkin-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template:   `<div class="checkin-checkout">
    <h2>Check-in / Check-out</h2>

    <!-- Filtros -->
    <div class="filtro">
      <input type="text" [(ngModel)]="filtroTexto" (input)="filtrarReservas()" placeholder="Nome / Documento / Telefone" />

      <select [(ngModel)]="filtroStatus" (change)="filtrarReservas()">
        <option value="">Todos</option>
        <option value="RESERVADO">Reservado</option>
        <option value="CHECKED_IN">Hospedado</option>
        <option value="CHECKED_OUT">Finalizado</option>
      </select>

      <button class="btn primary" (click)="carregarReservas()">Atualizar</button>
    </div>

    <!-- Tabela de reservas -->
    <div class="reservas-lista">
      <table *ngIf="reservasFiltradas.length > 0; else vazio">
        <thead>
          <tr>
            <th>Hóspede</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservasFiltradas; trackBy: trackById">
            <td>{{ r.hospede.nome }}</td>
            <td>{{ r.dataCheckin }}</td>
            <td>{{ r.dataCheckout }}</td>
            <td>
              <span class="status-label" [ngClass]="r.status">
                {{ r.status === 'RESERVADO' ? 'Reservado' : r.status === 'CHECKED_IN' ? 'Hospedado' : 'Finalizado' }}
              </span>
            </td>
            <td>
              <button *ngIf="r.status !== 'CHECKED_OUT'" class="btn secondary" (click)="selecionarReserva(r)">Selecionar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #vazio>
      <p class="vazio">Nenhuma reserva encontrada.</p>
    </ng-template>

    <!-- Painel lateral -->
    <div class="painel-lateral" *ngIf="reservaSelecionada">
      <h3>Detalhes da Reserva</h3>

      <div class="dados">
        <p><strong>Nome:</strong> {{ reservaSelecionada.hospede.nome }}</p>
        <p><strong>Documento:</strong> {{ reservaSelecionada.hospede.documento }}</p>
        <p><strong>Telefone:</strong> {{ reservaSelecionada.hospede.telefone }}</p>
        <p><strong>Possui carro:</strong> {{ reservaSelecionada.hospede.possuiCarro ? 'Sim' : 'Não' }}</p>
      </div>

      <div class="periodo">
        <p><strong>Check-in:</strong> {{ reservaSelecionada.dataCheckin }}</p>
        <p><strong>Check-out:</strong> {{ reservaSelecionada.dataCheckout }}</p>

        <label>
    Hora Check-out:
    <input type="time" [(ngModel)]="selectedHoraCheckout" 
           [disabled]="reservaSelecionada.status === 'RESERVADO'" />
  </label>
      </div>

      <div class="status-detalhe">
        <p>Status:</p>
        <span class="status-label" [ngClass]="reservaSelecionada.status">
          {{ reservaSelecionada.status === 'RESERVADO' ? 'Reservado' : reservaSelecionada.status === 'CHECKED_IN' ? 'Hospedado' : 'Finalizado' }}
        </span>
      </div>

      <div class="detalhes-custos" *ngIf="breakdown">
        <h4>Resumo de cobrança</h4>
        <p><strong>Noites:</strong> {{ breakdown.noites }}</p>

        <div *ngFor="let d of breakdown.diarias">
          <small>{{ d.data }} — {{ d.tipo }} — R$ {{ d.valor.toFixed(2) }}</small><br/>
        </div>

        <p><small>Subtotal diárias: R$ {{ breakdown.subtotal.toFixed(2) }}</small></p>
        <p *ngIf="breakdown.taxaEstacionamento > 0"><small>Taxa estacionamento: R$ {{ breakdown.taxaEstacionamento.toFixed(2) }}</small></p>
        <p *ngIf="breakdown.taxaAtraso > 0" class="alerta"><small>Multa atraso: R$ {{ breakdown.taxaAtraso.toFixed(2) }}</small></p>
        <p><strong>Total estimado: R$ {{ breakdown.totalFinal.toFixed(2) }}</strong></p>
      </div>

      <div class="alertas">
        <p *ngIf="reservaSelecionada?.hospede?.possuiCarro"><small>Inclui taxa de estacionamento (se aplicável por dia).</small></p>
        <p *ngIf="isCheckoutAfterAllowed()" class="alerta">ATENÇÃO: check-out após 12:00 — multa de 50% será aplicada.</p>
      </div>

      <div class="acoes">
        <button *ngIf="reservaSelecionada.status === 'RESERVADO'" class="btn primary" (click)="confirmarCheckin()">Confirmar Check-in</button>
        <button *ngIf="reservaSelecionada.status === 'CHECKED_IN'" class="btn primary" (click)="confirmarCheckout()">Confirmar Check-out</button>
      </div>

      <button class="btn secondary fechar" (click)="fecharPainel()">Fechar</button>
      <p *ngIf="mensagem" class="mensagem">{{ mensagem }}</p>
    </div>
  </div>
  `,
  styles: [`
    .checkin-checkout { max-width: 1200px; margin: 20px auto; padding: 16px; font-family: Arial, sans-serif; color: #333; }
    h2 { text-align: center; color: #1976d2; margin-bottom: 20px; }

    .filtro { display:flex; flex-wrap: wrap; gap:12px; align-items: center; margin-bottom: 20px; }
    .filtro input { padding:8px 12px; border-radius:6px; border:1px solid #ccc; min-width:300px; }
    .filtro select { padding:8px 12px; border-radius:6px; border:1px solid #ccc; }
    .filtro input:focus, .filtro select:focus { outline:none; border-color:#1976d2; }

    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; color: #fff; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn.primary { background-color:#1976d2; }
    .btn.secondary { background-color:#777; }
    .btn:hover { opacity: 0.85; }

    table { width: 100%; border-collapse: collapse; margin-top: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); border-radius:6px; overflow:hidden; }
    th, td { padding: 10px 12px; text-align: left; }
    th { background-color: #e3f2fd; }
    tbody tr { background-color:#fff; transition: background 0.2s; }
    tbody tr:hover { background-color:#f1f7ff; }

    .status-label { padding: 4px 10px; border-radius: 12px; color:#fff; font-weight:500; font-size:12px; display:inline-block; }
    .RESERVADO { background-color:#ff9800; }
    .CHECKED_IN { background-color:#4caf50; }
    .CHECKED_OUT { background-color:#9e9e9e; }

    .painel-lateral {
      position: fixed; right: 0; top: 0; width: 420px; height: 100%;
      background: #fff; border-left: 1px solid #ccc; padding: 20px; overflow-y: auto;
      box-shadow: -6px 0 12px rgba(0,0,0,0.12); border-radius: 0 8px 8px 0;
    }

    .dados, .periodo { margin-bottom: 16px; }
    .dados p, .periodo p, .detalhes-custos p, .detalhes-custos small, .alertas p { margin: 6px 0; font-size: 14px; }
    .detalhes-custos { margin-top:12px; background:#f9f9f9; padding:12px; border-radius:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .acoes { margin-top:12px; display:flex; gap:8px; flex-wrap: wrap; }
    .fechar { margin-top:10px; background-color:#777; }
    .mensagem { color: green; margin-top: 12px; font-weight: 500; }
    .alerta { color: red; font-weight: 500; }
    .vazio { text-align:center; color:#666; font-style: italic; margin-top:20px; }
  `]
})

export class CheckinCheckoutComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  reservaSelecionada: Reserva | null = null;
  filtroStatus = '';
  filtroTexto = '';
  mensagem = '';
  carregando = false;

  // campos do painel
  selectedHoraCheckout = '12:00';
  dataCheckin = '';
  dataCheckout = '';

  // breakdown calculado
  breakdown: {
    noites: number;
    diarias: Array<{ data: string; tipo: 'Dia útil' | 'Fim de semana'; valor: number }>;
    subtotal: number;
    taxaEstacionamento: number;
    taxaAtraso: number;
    totalFinal: number;
  } | null = null;

  readonly DIARIA_DIA_UTIL = 120;
  readonly DIARIA_FDS = 180;
  readonly TAXA_CARRO_DIA_UTIL = 15;
  readonly TAXA_CARRO_FDS = 20;
  readonly HORARIO_CHECKIN_PADRAO = '14:00:00';
  readonly HORARIO_CHECKOUT_PADRAO = '12:00:00';

  constructor(private reservaSvc: ReservaService) {}

  ngOnInit(): void {
    this.carregarReservas();
  }

  carregarReservas() {
    this.carregando = true;
    this.reservaSvc.listar().pipe(
      tap(res => {
        this.reservas = res;
        this.filtrarReservas();
      }),
      catchError(err => {
        console.error('Erro ao carregar reservas:', err);
        this.mensagem = 'Erro ao carregar reservas';
        return of([]);
      }),
      tap(() => this.carregando = false)
    ).subscribe();
  }

  filtrarReservas() {
    const txt = (this.filtroTexto || '').trim().toLowerCase();

    // aplica filtro por status primeiro
    let lista = this.filtroStatus ? this.reservas.filter(r => r.status === this.filtroStatus) : [...this.reservas];

    // aplica filtro textual (nome / documento / telefone)
    if (txt) {
      lista = lista.filter(r => {
        const h = r.hospede || ({} as any);
        const nome = (h.nome || '').toString().toLowerCase();
        const doc = (h.documento || '').toString().toLowerCase();
        const tel = (h.telefone || '').toString().toLowerCase();
        return nome.includes(txt) || doc.includes(txt) || tel.includes(txt);
      });
    }

    this.reservasFiltradas = lista;
  }

  trackById = (_: number, r: Reserva) => r.id;

  selecionarReserva(reserva: Reserva) {
    // cópia simples para edição local do painel (não muta lista até salvar)
    this.reservaSelecionada = { ...reserva };
    this.dataCheckin = this.reservaSelecionada.dataCheckin || '';
    this.dataCheckout = this.reservaSelecionada.dataCheckout || '';
    this.selectedHoraCheckout = this.reservaSelecionada.horaCheckout ? this.formatTime(this.reservaSelecionada.horaCheckout) : '12:00';
    this.recalcular();
    this.mensagem = '';
  }

  fecharPainel() {
    this.reservaSelecionada = null;
    this.breakdown = null;
    this.mensagem = '';
    // limpa filtros auxiliares se quiser
  }

  private formatTime(t?: string): string {
    if (!t) return '12:00';
    return t.length >= 5 ? t.substring(0,5) : t;
  }

  recalcular() {
    if (!this.reservaSelecionada || !this.dataCheckin || !this.dataCheckout) {
      this.breakdown = null;
      return;
    }

    const entrada = new Date(this.dataCheckin + 'T00:00:00');
    const saida = new Date(this.dataCheckout + 'T00:00:00');
    if (saida <= entrada) {
      this.breakdown = null;
      return;
    }

    const diarias: Array<{ data: string; tipo: 'Dia útil' | 'Fim de semana'; valor: number }> = [];
    let subtotal = 0;
    let taxaEstacionamento = 0;

    for (let d = new Date(entrada); d < saida; d.setDate(d.getDate() + 1)) {
      const diaIndex = d.getDay();
      const ehFimSemana = (diaIndex === 0 || diaIndex === 6);
      const diariaValor = ehFimSemana ? this.DIARIA_FDS : this.DIARIA_DIA_UTIL;
      diarias.push({
        data: d.toISOString().slice(0,10),
        tipo: ehFimSemana ? 'Fim de semana' : 'Dia útil',
        valor: diariaValor
      });
      subtotal += diariaValor;
      if (this.reservaSelecionada!.hospede?.possuiCarro) {
        taxaEstacionamento += ehFimSemana ? this.TAXA_CARRO_FDS : this.TAXA_CARRO_DIA_UTIL;
      }
    }

    let taxaAtraso = 0;
    if (this.isCheckoutAfterAllowed()) {
      taxaAtraso = subtotal * 0.5;
    }

    const totalFinal = subtotal + taxaEstacionamento + taxaAtraso;

    this.breakdown = {
      noites: diarias.length,
      diarias,
      subtotal,
      taxaEstacionamento,
      taxaAtraso,
      totalFinal
    };
  }

  isCheckoutAfterAllowed(): boolean {
    if (!this.selectedHoraCheckout) return false;
    const [h, m] = this.selectedHoraCheckout.split(':').map(x => parseInt(x,10));
    return (h > 12) || (h === 12 && m > 0);
  }

  // ===== Ações =====

  confirmarCheckin() {
    if (!this.reservaSelecionada) return;

    // Antes de confirmar check-in, não usamos horaCheckout (campo fica disabled enquanto reserva está RESERVADO)
    // opcional: alerta caso backend rejeite se for antes de 14:00 (mas aqui fixamos lógica do front)
    const id = this.reservaSelecionada.id!;
    this.reservaSvc.checkin(id).pipe(
      tap(res => {
        this.mensagem = `Check-in efetuado para ${this.reservaSelecionada?.hospede.nome}.`;
        this.carregarReservas();
        this.fecharPainel();
      }),
      catchError(err => {
        console.error('Erro check-in:', err);
        this.mensagem = err?.error?.message || 'Erro ao efetuar check-in';
        return of(null);
      })
    ).subscribe();
  }

  confirmarCheckout() {
    if (!this.reservaSelecionada) return;

    const id = this.reservaSelecionada.id!;
    // manter hora fixa de checkout no backend se preferir, mas aqui passamos a hora atual selecionada
    const horaCheckout = `${this.selectedHoraCheckout}:00`;

    if (this.isCheckoutAfterAllowed()) {
      const ok = confirm('Check-out após 12:00 aplicará multa de 50% sobre o subtotal. Deseja prosseguir?');
      if (!ok) return;
    }

    // Atualiza horaCheckout (opcional) e chama endpoint de checkout para cálculo final.
    // Se o seu backend aceita PUT /reservas/{id} para atualizar horaCheckout, você pode usar reservaSvc.atualizar antes do checkout.
    // Aqui chamamos direto o endpoint de checkout com body opcional (conforme seu service implementado).
    this.reservaSvc.checkout(id, { horaCheckout }).pipe(
      tap(res => {
        this.mensagem = `Check-out efetuado para ${this.reservaSelecionada?.hospede.nome}. Total: R$ ${res.valorTotal?.toFixed(2) ?? '0.00'}`;
        this.carregarReservas();
        this.fecharPainel();
      }),
      catchError(err => {
        console.error('Erro checkout:', err);
        this.mensagem = err?.error?.message || 'Erro ao efetuar check-out';
        return of(null);
      })
    ).subscribe();
  }
}
