import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagNotfountComponent } from './pag-notfount/pag-notfount.component';
import { AuthGuard } from './login/components/auth.guard';

const routes: Routes = [ 
   {
    path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)//especifico que cada ves que se habra esta ruta va a llamar a este componente
  },//este va ha ser mi ruta principa
  {
    path: 'bienvenido', loadChildren: () => import('./bienvenido/bienvenido.module').then(m => m.BienvenidoModule)//especifico que cada ves que se habra esta ruta va a llamar a este componente
  },//este va ha ser mi ruta principal
  {
    path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'categoria', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule)
  },
    {
    path: 'vendedor',
     loadChildren: () => import('./vendedor/vendedor.module').then(m => m.VendedorModule)
  },
  {
    path: 'clientes',
     loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule)
  },
  {
    path: 'productos',  loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule)
  },
  {
    path: 'ventas',  loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',//pongo el aterisco para que mande todo a notfun las paginas que no existen
    component: PagNotfountComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
