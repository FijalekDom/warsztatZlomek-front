import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { CompanyComponent } from './home-page/company/company.component';
import { OfferComponent } from './home-page/offer/offer.component';
import { ContactComponent } from './home-page/contact/contact.component';
import { RouterModule, Routes} from '@angular/router';
import { LoginClientComponent } from './login-client/login-client.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientAuthGuard} from './client-auth.guard';
import { AccountComponent } from './account/account.component';
import { RegisterClientComponent } from './register-client/register-client.component';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { LogoutClientComponent } from './logout-client/logout-client.component';
import { VisitsComponent } from './account/visits/visits.component';
import { CarsComponent } from './account/cars/cars.component';
import { NewVisitComponent } from './account/new-visit/new-visit.component';
import { ClientAccountComponent } from './account/client-account/client-account.component';
import { EmployeeSignInComponentComponent } from './employee-sign-in-component/employee-sign-in-component.component';


const appRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },

  {
    path: 'account',
    component: AccountComponent,
    canActivate: [ClientAuthGuard],
    children: [

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
        path: 'account/visits',
        component: VisitsComponent,
        canActivate: [ClientAuthGuard]
    },

    {
        path: 'account/cars',
        component: CarsComponent,
        canActivate: [ClientAuthGuard]
    },

    {
        path: 'account/new-visit',
        component: NewVisitComponent,
        canActivate: [ClientAuthGuard]
    },

    {
        path: 'account/my-account',
        component: ClientAccountComponent,
        canActivate: [ClientAuthGuard]
    },

  {
    path: 'employee',
    children: [
      {
        path: 'signIn',
        component: EmployeeSignInComponentComponent
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
    VisitsComponent,
    CarsComponent,
    NewVisitComponent,
    ClientAccountComponent,
    EmployeeSignInComponentComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ClientAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
