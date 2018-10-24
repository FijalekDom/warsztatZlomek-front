import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { CompanyComponent } from './company/company.component';
import { OfferComponent } from './offer/offer.component';
import { ContactComponent } from './contact/contact.component';
import {Routes} from '@angular/router';

const appRoutes: Routes = [
    {

    },
    {

    }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CompanyComponent,
    OfferComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
