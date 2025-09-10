import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { VendedorComponent } from './page/vendedor/vendedor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from "src/app/menu/menu.module";


@NgModule({
  declarations: [VendedorComponent],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule
]
})
export class VendedorModule { }
