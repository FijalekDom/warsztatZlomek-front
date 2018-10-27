import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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


const appRoutes: Routes = [
    {
        path: '',
        component: HomePageComponent
    },

    {
        path: 'account',
        component: AccountComponent,
        canActivate: [ClientAuthGuard]
    },

    {
        path: 'login',
        component: LoginClientComponent
    },

    {
        path: 'register',
        component: RegisterClientComponent
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
    RegisterClientComponent
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
export class AppModule { }
