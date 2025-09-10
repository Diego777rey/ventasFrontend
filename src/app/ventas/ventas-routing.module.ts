import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './page/ventas/ventas.component';
import { AuthGuard } from '../login/components/auth.guard';

const routes: Routes = [{
  path: '',
  component: VentasComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
