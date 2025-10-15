import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospedeFormComponent } from './hospede-form.component';
import { HospedesService, Hospede } from '../../core/service/hospedes.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservaFormComponent } from '../reserva-form/reserva-form.component';

describe('HospedeFormComponent', () => {
  let component: HospedeFormComponent;
  let fixture: ComponentFixture<HospedeFormComponent>;
  let mockHospedeService: jasmine.SpyObj<HospedesService>;

  const hospedeMock: Hospede = {
    nome: 'Maria',
    documento: '12345678901',
    telefone: '11999999999',
    possuiCarro: true
  };

  beforeEach(async () => {
    mockHospedeService = jasmine.createSpyObj('HospedesService', ['criar']);

    await TestBed.configureTestingModule({
      imports: [HospedeFormComponent, FormsModule, CommonModule, ReservaFormComponent],
      providers: [{ provide: HospedesService, useValue: mockHospedeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HospedeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve cadastrar hóspede com sucesso', (done) => {
    mockHospedeService.criar.and.returnValue(of(hospedeMock));
    component.hospede = { ...hospedeMock };

    component.cadastrar();

    setTimeout(() => {
      expect(component.mensagemSucesso).toContain('cadastrado com sucesso');
      expect(component.mensagemErro).toBe('');
      expect(component.hospedeCadastrado).toEqual(hospedeMock);
      done();
    }, 50);
  });

  it('deve tratar erro ao cadastrar hóspede', (done) => {
    spyOn(console, 'error');
    mockHospedeService.criar.and.returnValue(throwError({ error: { message: 'Erro teste' } }));
    component.hospede = { ...hospedeMock };

    component.cadastrar();

    setTimeout(() => {
      expect(component.mensagemErro).toBe('Erro ao cadastrar hóspede. Verifique os dados e tente novamente.');
      expect(component.mensagemSucesso).toBe('');
      expect(component.hospedeCadastrado).toBeNull();
      done();
    }, 50);
  });

  it('deve inicializar o hóspede corretamente', () => {
    expect(component.hospede).toEqual({ nome: '', documento: '', telefone: '', possuiCarro: false });
    expect(component.hospedeCadastrado).toBeNull();
  });

  it('deve atualizar hospedeCadastrado após cadastro', (done) => {
    mockHospedeService.criar.and.returnValue(of(hospedeMock));
    component.hospede = { ...hospedeMock };

    component.cadastrar();

    setTimeout(() => {
      expect(component.hospedeCadastrado).toEqual(hospedeMock);
      done();
    }, 50);
  });
});
