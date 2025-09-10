import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './page/ventas/ventas.component';
import { ClienteModalComponent } from './page/ventas/components/cliente-modal.component';
import { VendedorModalComponent } from './page/ventas/components/vendedor-modal.component';
import { ProductoModalComponent } from './page/ventas/components/producto-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VentasComponent,
    ClienteModalComponent,
    VendedorModalComponent,
    ProductoModalComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VentasModule { }
