import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HospedesService, Hospede } from './core/service/hospedes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  hospedes$: Observable<Hospede[]> = this.hospedesSvc.listar();

  constructor(private hospedesSvc: HospedesService) {}

  trackById = (_: number, h: Hospede) => h.id;
}
