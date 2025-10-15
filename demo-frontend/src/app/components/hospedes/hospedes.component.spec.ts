import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospedesComponent } from './hospedes.component';
import { HospedesService, Hospede } from '../../core/service/hospedes.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('HospedesComponent', () => {
  let component: HospedesComponent;
  let fixture: ComponentFixture<HospedesComponent>;
  let hospedesServiceSpy: jasmine.SpyObj<HospedesService>;

  const mockHospedes: Hospede[] = [
    { id: 1, nome: 'Bernardo', documento: '123', telefone: '9999-0000', possuiCarro: true },
    { id: 2, nome: 'Lucas', documento: '456', telefone: '8888-1111', possuiCarro: false },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HospedesService', ['listar']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HospedesComponent],
      providers: [{ provide: HospedesService, useValue: spy }]
    }).compileComponents();

    hospedesServiceSpy = TestBed.inject(HospedesService) as jasmine.SpyObj<HospedesService>;
    hospedesServiceSpy.listar.and.returnValue(of(mockHospedes));

    fixture = TestBed.createComponent(HospedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit é chamado aqui
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar hóspedes ao iniciar', () => {
    expect(component.hospedes.length).toBe(2);
    expect(component.hospedesFiltrados.length).toBe(2);
  });

  it('deve filtrar hóspedes pelo nome', () => {
    component.filtro = 'bernardo';
    component.buscar();
    expect(component.hospedesFiltrados.length).toBe(1);
    expect(component.hospedesFiltrados[0].nome).toBe('Bernardo');
  });

  it('deve filtrar hóspedes pelo documento', () => {
    component.filtro = '456';
    component.buscar();
    expect(component.hospedesFiltrados.length).toBe(1);
    expect(component.hospedesFiltrados[0].nome).toBe('Lucas');
  });

  it('deve filtrar hóspedes pelo telefone', () => {
    component.filtro = '9999';
    component.buscar();
    expect(component.hospedesFiltrados.length).toBe(1);
    expect(component.hospedesFiltrados[0].nome).toBe('Bernardo');
  });

  it('deve limpar o filtro e exibir todos os hóspedes', () => {
    component.filtro = 'bernardo';
    component.buscar();
    component.limpar();
    expect(component.filtro).toBe('');
    expect(component.hospedesFiltrados.length).toBe(2);
  });

  it('deve mostrar mensagem "Nenhum hóspede encontrado" quando filtro não achar nada', () => {
    component.filtro = 'não existe';
    component.buscar();
    fixture.detectChanges();
    const vazioEl = fixture.debugElement.query(By.css('.vazio'));
    expect(vazioEl.nativeElement.textContent).toContain('Nenhum hóspede encontrado');
  });
});
