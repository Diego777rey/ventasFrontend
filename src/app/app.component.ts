import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mostrarMenu: boolean = false;

  constructor(private router: Router) {
    //pasamos la url y verificamos el estado
    this.mostrarMenu = !this.router.url.includes('/login') && this.router.url !== '/';
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarMenu = !event.url.includes('/login') && event.url !== '/';
      }
    });
  }
}