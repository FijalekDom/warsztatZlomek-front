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
    accessToken: string;
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
    id?: number;
    vin?: string;
    registrationNumber?: string;
    model?: string;
    productionYear?: number;
    brandName?: string;
}

export interface ClientUpdateModel extends RegisterModel {
    accessToken: string;
}

export interface AddCarModel extends CarModel {
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


export interface VisitModel {
    car: CarModel;
    id: number;
    notVerifiedOwners;
    owners: UserData[];
    visitDate: DateConstructor;
}

export interface ShowVisitModel {
    car: CarModel;
    id: number;
    visitDate: DateConstructor;
    isOverview: boolean;
}

export interface BanUser {
  username: String;
  accessToken: String;
}

export interface GetCompanyModel extends TokenModel {
  companyId: number;
}

export interface CarIdModel {
    carId: number;
    accessToken: String;
}

export interface CarEditModel extends CarModel {
    carId: number;
    accessToken: String;
}

export interface CoownerModel extends CarIdModel {
    coownerUsername: String;
}

export interface CarHasCompanyModel extends CarIdModel {
    companyId: number;
}

export interface CompanyModel {
    aptNum?: string;
    buildingNum?: string;
    cityName?: string;
    streetName?: string;
    zipCode?: string;
    email?: string;
    id?: number;
    name?: string;
    nip?: string;
}

export interface CarBrandModel {
  brandName: String;
  accessToken: String;
}

export interface CarPartModel {
  name: string;
  tax: number;
  producer: string;
  accessToken: String;
}

export interface EditCompanyModel extends CompanyModel{
  id: number;
  accessToken: string;
}

export interface EditCarPartModel extends CarPartResponse {
  accessToken: string;
}

export interface ServiceModel {
  id: number;
  name: String;
  tax: number;
  accessToken: String;
}

export interface CarPartResponse {
  name: String;
  tax: number;
  producer: String;
  id: number;
}
export interface AddCompanyModel extends CompanyModel {
  accessToken: String;
}

export interface AddVisitModel {
    accessToken: String;
    carId: number;
    visitDate: String;
    isOverview: boolean;
}

export interface CarResponseModel {
  accessToken: String;
  id: number;
  vin: String;
  registrationNumber: String;
  model: String;
  productionYear: number;
  brandName: String;
}

export interface VisitResponse {
  id: number;
  visitDate: String;
  car: CarResponseModel;
  owners: UserData[];
  notVerifiedOwners: UserData[];
  status: String;
}
export interface RemoveVisitModel extends TokenModel {
    visitId: number;
}

export interface AddEmployeeToVisit extends TokenModel {
    visitId: number;
}



export interface SubmitVisitModel extends AddEmployeeToVisit {
    carParts: CarPartModel[];
    services: ServiceModel[];
    countYears: number;
    status: String;
}

export interface ShowEmployeeVisitModel extends VisitModel {
    status: String;
}

export interface InvoiceForm {
  accessToken: string;
  discount: number;
  methodOfPayment: string;
  paymentDate: string;
  visitId: number;
  companyName: string;
}

export interface InvoiceResponse {
  dayOfIssue: string;
  discount: number;
  grossValue: string;
  netValue: string;
  invoiceNumber: string;
  methodOfPayment: string;
  paymentDate: string;
  carServiceData: CompanyModel;
  companyData: CompanyModel;
  positions: InvoicePositionResponse[];
}

export interface InvoicePositionResponse {
  positionName: string;
  grossPrice: string;
  netPrice: string;
  unitOfMeasure: string;
  valueOfVat: string;
  vatTax: string;
}
