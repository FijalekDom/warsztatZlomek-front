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
        this.rightMenu = this.employeeLoginRightMenu;
        this.leftMenu = this.employeeLoginLeftMenu;
      } else if (currentUrl.includes('/employee')) {
        this.rightMenu = this.employeeBeginRightMenu;
        this.leftMenu = this.employeeBeginLeftMenu;
      } else if (currentUrl.includes('/account')) {
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

  loginLeftMenu = [{url: 'account/visits', text: 'Wizyty'}, {url: 'account/cars', text: 'Samochody'}, {url: 'account/new-visit', text: 'Nowa wizyta'}];
  loginRightMenu = [{url: 'account/my-account', text: 'Moje konto'}, {url: '/logout', text: 'wyloguj'}];

  employeeBeginLeftMenu = [{url: '#', text: ''}, {url: '#', text: ''}, {url: '#', text: ''}];
  employeeBeginRightMenu = [];

  employeeLoginLeftMenu = [{url: '#', text: 'Wizyty'}, {url: '#', text: 'Samochody'}, {url: '#', text: 'Nowa wizyta'},
    {url: 'javascript:void(0)', text: 'Faktury'}];
  employeeLoginRightMenu = [{url: 'employee/logout', text: 'wyloguj'}];

  ngOnInit() {

  }


}
