import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) {
    router.events.subscribe((x) => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/account')) {
        this.leftMenu = this.loginLeftMenu;
        this.rightMenu = this.loginRightMenu;
      } else {
        this.leftMenu = this.beginLeftMenu;
        this.rightMenu = this.beginRightMenu;
      }
    });
  }

  leftMenu = [];
  rightMenu = [];

  beginLeftMenu = [{url: '#', text: 'O firmie'}, {url: '#', text: 'Oferta'}, {url: '#', text: 'Kontakt'}];
  beginRightMenu = [{url: '/login', text: 'Zaloguj'}, {url: 'register', text: 'Zarejestruj'}];

  loginLeftMenu = [{url: '#', text: 'Wizyty'}, {url: '#', text: 'Samochody'}, {url: '#', text: 'Nowa wizyta'}];
  loginRightMenu = [{url: 'javascript:void(0)', text: 'Moje konto'}, {url: '/logout', text: 'wyloguj'}];

  observer = {
    next: x => console.log('Observer got a next value: ' + x),
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };

  ngOnInit() {

  }


}
