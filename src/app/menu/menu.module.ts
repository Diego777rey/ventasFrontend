import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './page/menu/menu.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    MenuRoutingModule
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
