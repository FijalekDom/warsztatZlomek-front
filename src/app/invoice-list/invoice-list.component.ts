import { Component, OnInit } from '@angular/core';
import {InvoiceResponse} from '../app.component';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  private invoices: InvoiceResponse[];
  constructor(private auth: AuthService,
              private  router: Router) { }

  ngOnInit() {
    this.auth.getInvoices().subscribe((result) => {
      this.auth.setExpirationDate();
      this.invoices = result.invoices;
      this.invoices.forEach((invoice) => {
        const date = new Date(invoice.dayOfIssue);
        invoice.dayOfIssue = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      });
    });
  }

  edit(i) {
    this.router.navigate(['/employee/account/editInvoice', i]);
  }

  load(i) {
    // dopisz pobranie faktury
  }
}
