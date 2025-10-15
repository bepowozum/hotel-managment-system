import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospedesComponent } from './components/hospedes/hospedes.component';
import { ReservasListComponent } from './components/reservas-list/reservas-list.component';
import { HospedeFormComponent } from './components/hospede-form/hospede-form.component';
import { CheckinCheckoutComponent } from './components/checkin-checkout/checkin-checkout.component';

const routes: Routes = [
  { path: 'hospedes', component: HospedesComponent },
  { path: 'hospedes/cadastro', component: HospedeFormComponent },
  { path: 'reservas/check', component: CheckinCheckoutComponent },
  // { path: '', pathMatch: 'full', redirectTo: 'hospedes' },
  // { path: '**', redirectTo: 'hospedes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}