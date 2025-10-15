import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Componentes standalone
import { HospedesComponent } from './components/hospedes/hospedes.component';
import { ReservasListComponent } from './components/reservas-list/reservas-list.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { CheckinCheckoutComponent } from './components/checkin-checkout/checkin-checkout.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    HospedesComponent,
    ReservasListComponent,
    ReservaFormComponent,
    CheckinCheckoutComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
