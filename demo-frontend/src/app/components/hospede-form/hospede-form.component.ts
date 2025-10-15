import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospedesService, Hospede } from '../../core/service/hospedes.service';
import { ReservaFormComponent } from '../reserva-form/reserva-form.component';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-hospede-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReservaFormComponent],
  template:  `
    <div class="form-container">
      <h2>Cadastrar Hóspede</h2>

      <form (ngSubmit)="cadastrar()" #formHospede="ngForm" novalidate>
        <div class="campo">
          <label>Nome</label>
          <input
            type="text"
            [(ngModel)]="hospede.nome"
            name="nome"
            required
            placeholder="Ex: João da Silva"
            #nome="ngModel"
          />
          <small *ngIf="nome.invalid && nome.touched" class="erro">
            O nome é obrigatório.
          </small>
        </div>

        <div class="campo">
          <label>Documento (CPF)</label>
          <input
            type="text"
            [(ngModel)]="hospede.documento"
            name="documento"
            required
            maxlength="11"
            pattern="\\d{11}"
            placeholder="Somente números"
            #documento="ngModel"
          />
          <small *ngIf="documento.invalid && documento.touched" class="erro">
            Informe um CPF válido com 11 dígitos.
          </small>
        </div>

        <div class="campo">
          <label>Telefone</label>
          <input
            type="text"
            [(ngModel)]="hospede.telefone"
            name="telefone"
            required
            maxlength="11"
            pattern="\\d{10,11}"
            placeholder="DDD + número"
            #telefone="ngModel"
          />
          <small *ngIf="telefone.invalid && telefone.touched" class="erro">
            Informe um telefone válido (até 11 números).
          </small>
        </div>

        <div class="campo checkbox">
          <label>
            <input
              type="checkbox"
              [(ngModel)]="hospede.possuiCarro"
              name="possuiCarro"
            />
            Possui carro
          </label>
        </div>

        <button
          type="submit"
          [disabled]="formHospede.invalid"
          class="btn primary"
        >
          Cadastrar
        </button>
      </form>

      <p *ngIf="mensagemSucesso" class="mensagem">{{ mensagemSucesso }}</p>
      <p *ngIf="mensagemErro" class="mensagem alerta">{{ mensagemErro }}</p>

      <app-reserva-form
        *ngIf="hospedeCadastrado"
        [hospede]="hospedeCadastrado"
      ></app-reserva-form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      color: #333;
    }

    h2 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .campo {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 6px;
    }

    input[type="text"],
    input[type="checkbox"] {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }

    input:focus {
      border-color: #1976d2;
      outline: none;
      box-shadow: 0 0 0 2px rgba(25,118,210,0.2);
    }

    .checkbox label {
      font-weight: normal;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      background-color: #1976d2;
      transition: background 0.2s;
    }

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn:hover:not(:disabled) {
      background-color: #115293;
    }

    .mensagem {
      text-align: center;
      font-weight: 500;
      margin-top: 12px;
    }

    .alerta {
      color: red;
    }

    small.erro {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
  `]
})
export class HospedeFormComponent {
  hospede: Hospede = { nome: '', documento: '', telefone: '', possuiCarro: false };
  hospedeCadastrado: Hospede | null = null;

  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private svc: HospedesService) {}

  cadastrar() {
    this.svc.criar(this.hospede)
      .pipe(
        tap(res => {
          this.mensagemSucesso = `Hóspede ${res.nome} cadastrado com sucesso!`;
          this.mensagemErro = '';
          this.hospedeCadastrado = res; // 👉 exibe o form de reserva abaixo
        }),
        catchError(err => {
          console.error('Erro ao cadastrar hóspede:', err);
          this.mensagemErro = 'Erro ao cadastrar hóspede. Verifique os dados e tente novamente.';
          this.mensagemSucesso = '';
          return of(null);
        })
      )
      .subscribe();
  }
}
