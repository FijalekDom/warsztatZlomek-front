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

export interface TokenModel {
    accessToken?: string;
}

export interface UserData {
    accessToken: string;
    aptNum: string;
    buildNum: string;
    cityName: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    streetName: string;
    zipCode: string;
}

export interface CarModel {
    vin?: string;
    registrationNumber?: string;
    model?: string;
    productionYear?: number;
    brandName?: string;
}

export interface ClientUpdateModel extends RegisterModel {
    accessToken?: string;
}

export interface RegisterEmployeeModel {
  firstName: String;
  lastName: String;
  email: String;
  hireDate: String;
  password: String;
  confirmPassword: String;
  accessToken: String;
}

export interface RemoveEmployeeModel {
  employeeMail: String;
  accessToken: String;
  quitDate: String;
}

export interface VisitsModel {

}
