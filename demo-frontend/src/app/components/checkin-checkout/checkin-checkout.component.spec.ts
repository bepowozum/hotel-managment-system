import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckinCheckoutComponent } from './checkin-checkout.component';
import { ReservaService, Reserva } from '../../core/service/reserva.service';
import { of, throwError } from 'rxjs';

describe('CheckinCheckoutComponent', () => {
  let component: CheckinCheckoutComponent;
  let fixture: ComponentFixture<CheckinCheckoutComponent>;
  let reservaServiceSpy: jasmine.SpyObj<ReservaService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReservaService', ['listar', 'checkin', 'checkout']);

    await TestBed.configureTestingModule({
      imports: [CheckinCheckoutComponent],
      providers: [{ provide: ReservaService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckinCheckoutComponent);
    component = fixture.componentInstance;
    reservaServiceSpy = TestBed.inject(ReservaService) as jasmine.SpyObj<ReservaService>;
  });

  it('deve carregar reservas com sucesso', () => {
    const mockReservas: Reserva[] = [
      { id: 1, hospede: { nome: 'João', documento: '123', telefone: '1111', possuiCarro: false }, dataCheckin: '2025-10-15', dataCheckout: '2025-10-16', status: 'RESERVADO', horaCheckout: '12:00', valorTotal: 150 },
      { id: 2, hospede: { nome: 'Maria', documento: '456', telefone: '2222', possuiCarro: true }, dataCheckin: '2025-10-15', dataCheckout: '2025-10-16', status: 'CHECKED_IN', horaCheckout: '12:00', valorTotal: 180 }
    ];
    reservaServiceSpy.listar.and.returnValue(of(mockReservas));

    component.carregarReservas();

    expect(component.reservas.length).toBe(2);
    expect(component.reservasFiltradas.length).toBe(2);
  });

  it('deve confirmar check-in com sucesso', () => {
    const reserva = { id: 1, hospede: { nome: 'João' }, status: 'RESERVADO', horaCheckout: '12:00' } as any;
    component.selecionarReserva(reserva);

    reservaServiceSpy.checkin.and.returnValue(of({
      id: 1,
      hospede: { nome: 'João' }
    }));

    component.confirmarCheckin();

    expect(component.mensagem).toContain('Check-in efetuado');
  });

  it('deve tratar erro ao confirmar check-in', () => {
    const reserva = { id: 1, hospede: { nome: 'João' }, status: 'RESERVADO', horaCheckout: '12:00' } as any;
    component.selecionarReserva(reserva);

    reservaServiceSpy.checkin.and.returnValue(throwError({ error: { message: 'Erro teste' } }));

    component.confirmarCheckin();

    expect(component.mensagem).toContain('Erro teste');
  });

  it('deve confirmar check-out com sucesso', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const reserva = { id: 2, hospede: { nome: 'Maria' }, status: 'CHECKED_IN', horaCheckout: '12:00' } as any;
    component.selecionarReserva(reserva);
    component.selectedHoraCheckout = '13:00';

    reservaServiceSpy.checkout.and.returnValue(of({
      id: 2,
      hospede: { nome: 'Maria' },
      valorTotal: 180
    }));

    component.confirmarCheckout();

    expect(component.mensagem).toContain('Check-out efetuado');
  });

  it('deve tratar erro ao confirmar check-out', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const reserva = { id: 2, hospede: { nome: 'Maria' }, status: 'CHECKED_IN', horaCheckout: '12:00' } as any;
    component.selecionarReserva(reserva);

    reservaServiceSpy.checkout.and.returnValue(throwError({ error: { message: 'Erro teste' } }));

    component.confirmarCheckout();

    expect(component.mensagem).toContain('Erro teste');
  });
});
