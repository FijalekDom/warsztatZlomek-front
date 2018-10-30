import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'warsztatZlomek-frontend';
}

export interface LoginModel {
    email?: string;
    password?: string;
}

export interface RegisterModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    cityName?: string;
    streetName?: string;
    buildNum?: string;
    aptNum?: string;
    zipCode?: string;
    password?: string;
    confirmPassword?: string;
}
