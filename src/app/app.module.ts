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



const appRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },

  {
    path: 'account',
    children: [
        {
          path: '',
          component: AccountComponent,
          canActivate: [ClientAuthGuard]
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
            path: 'registerEmployee',
            component: RegisterEmployeeComponent
          },
          {
            path: 'removeEmployee',
            component: RemoveEmployeeComponent
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
    CarRmCompanyComponent
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
