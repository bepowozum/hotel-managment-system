import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservaFormComponent } from './reserva-form.component';
import { ReservaService, Reserva } from '../../core/service/reserva.service';
import { Hospede } from '../../core/service/hospedes.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ReservaFormComponent', () => {
  let component: ReservaFormComponent;
  let fixture: ComponentFixture<ReservaFormComponent>;
  let mockReservaService: jasmine.SpyObj<ReservaService>;

  const hospedeMock: Hospede = {
    nome: 'João',
    documento: '123456789',
    telefone: '999999999',
    possuiCarro: true
  };

  beforeEach(async () => {
    mockReservaService = jasmine.createSpyObj('ReservaService', ['criar']);

    await TestBed.configureTestingModule({
      imports: [ReservaFormComponent, FormsModule, CommonModule],
      providers: [{ provide: ReservaService, useValue: mockReservaService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaFormComponent);
    component = fixture.componentInstance;
    component.hospede = hospedeMock;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve resetar campos no ngOnChanges', () => {
    component.dataEntrada = '2025-10-15';
    component.dataSaida = '2025-10-16';
    component.valorEstimado = 100;
    component.mensagem = 'teste';
    component.mensagemErro = true;

    component.ngOnChanges({ hospede: { currentValue: hospedeMock, previousValue: null, firstChange: false, isFirstChange: () => false } });

    expect(component.dataEntrada).toBe('');
    expect(component.dataSaida).toBe('');
    expect(component.valorEstimado).toBeNull();
    expect(component.mensagem).toBe('');
    expect(component.mensagemErro).toBeFalse();
  });

  it('deve calcular estimativa corretamente', () => {
    component.dataEntrada = '2025-10-15'; // quarta-feira
    component.dataSaida = '2025-10-17';   // sexta-feira
    component.atualizarEstimativa();

    // 15 e 16/10 são dias úteis + taxa de carro
    // diária dia útil: 120, taxa carro: 15 => total por dia: 135
    expect(component.valorEstimado).toBe(135 * 2);
  });

  it('deve limpar formulário', () => {
    component.dataEntrada = '2025-10-15';
    component.dataSaida = '2025-10-16';
    component.valorEstimado = 200;
    component.mensagem = 'Mensagem';
    component.mensagemErro = true;

    component.limpar();

    expect(component.dataEntrada).toBe('');
    expect(component.dataSaida).toBe('');
    expect(component.valorEstimado).toBeNull();
    expect(component.mensagem).toBe('');
    expect(component.mensagemErro).toBeFalse();
  });

  it('deve criar reserva com sucesso', (done) => {
    mockReservaService.criar.and.returnValue(of({} as Reserva));

    component.dataEntrada = '2025-10-15';
    component.dataSaida = '2025-10-16';
    component.criarReserva();

    setTimeout(() => {
      expect(component.mensagemErro).toBeFalse();
      expect(component.mensagem).toContain('Reserva criada com sucesso');
      expect(component.dataEntrada).toBe('');
      expect(component.dataSaida).toBe('');
      expect(component.valorEstimado).toBeNull();
      done();
    }, 50);
  });

  it('deve tratar erro na criação de reserva', (done) => {
    spyOn(console, 'error');
    mockReservaService.criar.and.returnValue(throwError({ error: { message: 'Erro teste' } }));

    component.dataEntrada = '2025-10-15';
    component.dataSaida = '2025-10-16';
    component.criarReserva();

    setTimeout(() => {
      expect(component.mensagemErro).toBeTrue();
      expect(component.mensagem).toBe('Erro teste');
      done();
    }, 50);
  });

  it('deve validar datas inválidas', () => {
    component.dataEntrada = '2025-10-16';
    component.dataSaida = '2025-10-15';

    component.criarReserva();

    expect(component.mensagemErro).toBeTrue();
    expect(component.mensagem).toBe('Data de saída deve ser posterior à entrada.');
  });

  it('deve exigir preenchimento de datas', () => {
    component.dataEntrada = '';
    component.dataSaida = '';

    component.criarReserva();

    expect(component.mensagemErro).toBeTrue();
    expect(component.mensagem).toBe('Preencha entrada e saída.');
  });
});
