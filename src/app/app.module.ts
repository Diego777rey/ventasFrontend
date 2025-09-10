import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagNotfountComponent } from './pag-notfount/pag-notfount.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { ApolloModule } from 'apollo-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from './menu/menu.module';

@NgModule({
  declarations: [
    AppComponent,
    PagNotfountComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,//para que funcionen las rutas si o si hay que importar el router module y el ruting module en el approuting
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ApolloModule,
    BrowserAnimationsModule,
    MenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
