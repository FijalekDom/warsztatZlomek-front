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
      if (currentUrl.includes('/employee/account')) {
        this.logo = false;
      } else if (currentUrl.includes('/employee')) {
        this.rightMenu = this.employeeBeginRightMenu;
        this.leftMenu = this.employeeBeginLeftMenu;
        this.logoHref = 'http://localhost:4200/employee';
      } else if (currentUrl.includes('/account')) {
        this.leftMenu = this.loginLeftMenu;
        this.rightMenu = this.loginRightMenu;
        this.logoHref = 'http://localhost:4200/account';
      } else {
        this.leftMenu = this.beginLeftMenu;
        this.rightMenu = this.beginRightMenu;
        this.logoHref = 'http://localhost:4200';
      }
    });
  }

  logo = true;
  logoHref: string;
  leftMenu = [];
  rightMenu = [];

  beginLeftMenu = [{url: '#', text: 'O firmie'}, {url: '#', text: 'Oferta'}, {url: '#', text: 'Kontakt'},
    {url: '/checkVin', text: 'Sprawdź historię napraw'}];
  beginRightMenu = [{url: '/login', text: 'Zaloguj'}, {url: 'register', text: 'Zarejestruj'}];

  loginLeftMenu = [{url: 'account/visits', text: 'Wizyty'}, {url: 'account/cars', text: 'Samochody'},
    {url: 'account/new-visit', text: 'Nowa wizyta'}];
  loginRightMenu = [{url: 'account/my-account', text: 'Moje konto'}, {url: '/logout', text: 'wyloguj'}];

  employeeBeginLeftMenu = [{url: '#', text: ''}, {url: '#', text: ''}, {url: '#', text: ''}];
  employeeBeginRightMenu = [];
  ngOnInit() {

  }


}

