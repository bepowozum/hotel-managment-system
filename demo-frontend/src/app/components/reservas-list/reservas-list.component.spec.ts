import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ReservasListComponent } from './reservas-list.component';
import { ReservaService, Reserva } from '../../core/service/reserva.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('ReservasListComponent', () => {
  let component: ReservasListComponent;
  let fixture: ComponentFixture<ReservasListComponent>;
  let mockReservaService: jasmine.SpyObj<ReservaService>;

  const reservasMock: Reserva[] = [
    { id: 1, hospede: { nome: 'João' } as any, dataCheckin: '2025-10-15', horaCheckin: '14:00', dataCheckout: '2025-10-16', horaCheckout: '12:00', status: 'RESERVADO', valorTotal: 150 },
    { id: 2, hospede: { nome: 'Maria' } as any, dataCheckin: '2025-10-15', horaCheckin: '14:00', dataCheckout: '2025-10-16', horaCheckout: '12:00', status: 'CHECKED_IN', valorTotal: 180 },
  ];

  beforeEach(async () => {
    mockReservaService = jasmine.createSpyObj('ReservaService', ['listar', 'checkin', 'checkout']);

    await TestBed.configureTestingModule({
      imports: [ReservasListComponent, CommonModule],
      providers: [
        { provide: ReservaService, useValue: mockReservaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar reservas no ngOnInit', () => {
    mockReservaService.listar.and.returnValue(of(reservasMock));
    fixture.detectChanges(); // dispara ngOnInit

    component.reservas$.subscribe(res => {
      expect(res.length).toBe(2);
      expect(res[0].hospede.nome).toBe('João');
    });
  });

  it('deve chamar checkin e atualizar lista', () => {
    mockReservaService.checkin.and.returnValue(of(null));
    mockReservaService.listar.and.returnValue(of(reservasMock));

    component.doCheckin(1);

    expect(mockReservaService.checkin).toHaveBeenCalledWith(1);
    expect(mockReservaService.listar).toHaveBeenCalled();
  });

  it('deve lidar com erro no checkin', () => {
    spyOn(window, 'alert');
    mockReservaService.checkin.and.returnValue(throwError({ error: { message: 'Erro no checkin' } }));

    component.doCheckin(1);
    expect(window.alert).toHaveBeenCalledWith('Erro no check-in: Erro no checkin');
  });

  it('deve chamar checkout e atualizar lista', () => {
    mockReservaService.checkout.and.returnValue(of(null));
    mockReservaService.listar.and.returnValue(of(reservasMock));

    component.doCheckout(2);

    expect(mockReservaService.checkout).toHaveBeenCalledWith(2);
    expect(mockReservaService.listar).toHaveBeenCalled();
  });

  it('deve lidar com erro no checkout', () => {
    spyOn(window, 'alert');
    mockReservaService.checkout.and.returnValue(throwError({ message: 'Erro no checkout' }));

    component.doCheckout(2);
    expect(window.alert).toHaveBeenCalledWith('Erro no check-out: Erro no checkout');
  });

  it('trackById deve retornar id da reserva', () => {
    const reserva = reservasMock[0];
    expect(component.trackById(0, reserva)).toBe(reserva.id);
  });
});
