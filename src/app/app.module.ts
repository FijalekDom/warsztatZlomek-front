import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {CompanyComponent} from './home-page/company/company.component';
import {OfferComponent} from './home-page/offer/offer.component';
import {ContactComponent} from './home-page/contact/contact.component';
import {RouterModule, Routes} from '@angular/router';
import {LoginClientComponent} from './login-client/login-client.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ClientAuthGuard} from './client-auth.guard';
import {AccountComponent} from './account/account.component';
import {RegisterClientComponent} from './register-client/register-client.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LogoutClientComponent} from './logout-client/logout-client.component';
import {VisitsComponent} from './account/visits/visits.component';
import {CarsComponent} from './account/cars/cars.component';
import {NewVisitComponent} from './account/new-visit/new-visit.component';
import {ClientAccountComponent} from './account/client-account/client-account.component';
import {EmployeeSignInComponentComponent} from './employee-sign-in-component/employee-sign-in-component.component';
import {EmployeeWelcomeSiteComponent} from './employee-welcome-site/employee-welcome-site.component';
import {EmployeeAuthGuard} from './EmployeeAuthGuard';
import { EmployeeLogoutComponent } from './employee-logout/employee-logout.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { RemoveEmployeeComponent } from './remove-employee/remove-employee.component';
import { CarAddCoownerComponent } from './account/cars/car-add-coowner/car-add-coowner.component';
import { CarRmCoownerComponent } from './account/cars/car-rm-coowner/car-rm-coowner.component';
import { CarAddCompanyComponent } from './account/cars/car-add-company/car-add-company.component';
import { CarRmCompanyComponent } from './account/cars/car-rm-company/car-rm-company.component';
import { BanUserComponent } from './ban-user/ban-user.component';
import { EmployeeAddVisitComponent } from './employee-add-visit/employee-add-visit.component';
import { AddCarBrandComponent } from './add-car-brand/add-car-brand.component';
import { AddCarPartComponent } from './add-car-part/add-car-part.component';
import { EditVisitElementsComponent } from './edit-visit-elements/edit-visit-elements-component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCarServiceDataComponent } from './add-car-service-data/add-car-service-data.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';

import { EmployeeGetNotFinishedVisitsComponent } from './employee-get-not-finished-visits/employee-get-not-finished-visits.component';
import { EmployeeGetNewVisitsComponent } from './employee-get-new-visits/employee-get-new-visits.component';
import { EmployeeEmployeesVisitsComponent } from './employee-employees-visits/employee-employees-visits.component';
import { GenerateInvoiceFormComponent } from './generate-invoice-form/generate-invoice-form.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { EditCompanyFormComponent } from './edit-company-form/edit-company-form.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { GetProFormaInvoicesListComponent } from './get-pro-forma-invoices-list/get-pro-forma-invoices-list.component';
import { AddClientToCompanyFormComponent } from './add-client-to-company-form/add-client-to-company-form.component';
import { RemoveClientFromCompanyComponent } from './remove-client-from-company/remove-client-from-company.component';



const appRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },

  {
    path: 'account',
    canActivate: [ClientAuthGuard],
    children: [
        {
          path: '',
          component: AccountComponent
        },
        {
          path: 'visits',
          component: VisitsComponent
        },

        {
          path: 'cars',
          component: CarsComponent
        },

        {
          path: 'new-visit',
          component: NewVisitComponent
        },

        {
          path: 'my-account',
          component: ClientAccountComponent
        }
    ]
  },

  {
    path: 'login',
    component: LoginClientComponent
  },

  {
    path: 'register',
    component: RegisterClientComponent
  },

  {
    path: 'logout',
    component: LogoutClientComponent
  },
  {
    path: 'employee',
    children: [
      {
        path: '',
        component: EmployeeSignInComponentComponent
      },
      {
        path: 'account',
        canActivate: [EmployeeAuthGuard],
        children: [
          {
            path: '',
            component: EmployeeWelcomeSiteComponent
          },
          {
            path: 'add-visit',
            component: EmployeeAddVisitComponent
          },
          {
            path: 'registerEmployee',
            component: RegisterEmployeeComponent
          },
          {
            path: 'removeEmployee',
            component: RemoveEmployeeComponent
          },
          {
            path: 'banUser',
            component: BanUserComponent
          },
          {
            path: 'addCarBrand',
            component: AddCarBrandComponent
          },
          {
            path: 'addCarPart',
            component: AddCarPartComponent
          },
          {
            path: 'addCompany',
            component: AddCompanyComponent
          },
          {

            path: 'addCarServiceData',
            component: AddCarServiceDataComponent
          },
          {
            path: 'generateInvoice',
            component: GenerateInvoiceComponent
          },
          {
            path: 'showNotFinishedVisits',
            component: EmployeeGetNotFinishedVisitsComponent
          },
          {
            path: 'showNewVisits',
            component: EmployeeGetNewVisitsComponent
          },
          {
            path: 'showEmployeeVisits',
            component: EmployeeEmployeesVisitsComponent
          },
          {
            path: 'generateInvoiceForm/:id',
            component: GenerateInvoiceFormComponent
          },
          {
            path: 'editVisitElementsPart',
            component: EditVisitElementsComponent
          },
          {
            path: 'companyList',
            component: CompanyListComponent
          },
          {
            path: 'editCompany/:id',
            component: EditCompanyFormComponent
          },
          {
            path: 'invoices',
            component: InvoiceListComponent
          },
          {
            path: 'invoices/:id',
            component: EditInvoiceComponent
          },
          {
            path: 'proFormaInvoices',
            component: GetProFormaInvoicesListComponent
          },
          {
            path: 'addProFormaInvoice',
            component: GenerateInvoiceComponent
          },
          {
            path: 'generateProFormaInvoiceForm/:id',
            component: GenerateInvoiceFormComponent
          },
          {
            path: 'addClientToCompany',
            component: AddClientToCompanyFormComponent
          },
          {
            path: 'removeClientFromCompany',
            component: RemoveClientFromCompanyComponent
          }
        ]
      },
      {
        path: 'logout',
        component: EmployeeLogoutComponent
      }
    ]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CompanyComponent,
    OfferComponent,
    ContactComponent,
    LoginClientComponent,
    HomePageComponent,
    AccountComponent,
    RegisterClientComponent,
    LogoutClientComponent,
    EmployeeSignInComponentComponent,
    EmployeeWelcomeSiteComponent,
    VisitsComponent,
    CarsComponent,
    NewVisitComponent,
    ClientAccountComponent,
    EmployeeLogoutComponent,
    RegisterEmployeeComponent,
    RemoveEmployeeComponent,
    CarAddCoownerComponent,
    CarRmCoownerComponent,
    CarAddCompanyComponent,
    CarRmCompanyComponent,
    BanUserComponent,
    EmployeeAddVisitComponent,
    AddCarBrandComponent,
    AddCarPartComponent,
    EditVisitElementsComponent,
    AddCompanyComponent,
    AddCarServiceDataComponent,
    GenerateInvoiceComponent,
    EmployeeGetNotFinishedVisitsComponent,
    EmployeeGetNewVisitsComponent,
    EmployeeEmployeesVisitsComponent,
    GenerateInvoiceFormComponent,
    CompanyListComponent,
    EditCompanyFormComponent,
    InvoiceListComponent,
    EditInvoiceComponent,
    GetProFormaInvoicesListComponent,
    AddClientToCompanyFormComponent,
    RemoveClientFromCompanyComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ClientAuthGuard, EmployeeAuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {
}
