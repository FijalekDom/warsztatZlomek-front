import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {TokenModel, VisitResponse} from '../app.component';
import {visit} from '@angular/compiler-cli/src/ngtsc/util/src/visitor';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }
  private visits: VisitResponse[] = [];

  ngOnInit() {
    const accessToken: TokenModel = {
      accessToken: this.authService.getAccessToken()
    };
    this.authService.getEmployeesVisits(accessToken).subscribe(data => {
      this.authService.setExpirationDate();
      this.visits = data.visits;
      this.visits.forEach(obj => {
        const date = new Date(parseInt(obj.visitDate.valueOf(), 10));
        obj.visitDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
      });
    });
  }

  createInvoice(i: number) {
    if (this.router.url.includes('ProForma')) {
      this.router.navigate(['employee/account/generateProFormaInvoiceForm', this.visits[i].id]);
    } else {
      this.router.navigate(['employee/account/generateInvoiceForm', this.visits[i].id]);
    }
  }

}
