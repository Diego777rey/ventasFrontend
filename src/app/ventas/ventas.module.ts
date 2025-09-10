import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './page/ventas/ventas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VentasModule { }
