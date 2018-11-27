import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {GetVisitDetails, VisitResponse} from '../app.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-display-visit-details',
  templateUrl: './display-visit-details.component.html',
  styleUrls: ['./display-visit-details.component.css']
})
export class DisplayVisitDetailsComponent implements OnInit {
  private visit: VisitResponse;
  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const visitId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    const form: GetVisitDetails = {
      accessToken: this.auth.getAccessToken(),
      visitId: visitId
    };
    this.auth.getVisitDetails(form).subscribe((result) => {
      this.visit = result.details;
      const date = new Date(parseInt(this.visit.visitDate, 10));
      this.visit.visitDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      this.visit.visitStatus = this.convertStatus();
      this.auth.setExpirationDate();
      console.log(this.visit);
    }, (result) => {
      console.log(result);
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
  }

  convertStatus() {
    switch (this.visit.visitStatus) {
      case ('NEW'):
        return 'Nowa';
      case ('ACCEPTED'):
        return 'Zaakceptowana';
      case ('IN PROGRESS'):
        return 'W trakcie';
      case ('FOR PICKUP'):
        return 'Do odbioru';
      case ('FINISHED'):
        return 'Zakończona';
      default:
        return null;
    }
  }

  createInvoice () {
    this.router.navigate(['employee/account/generateInvoiceForm', this.visit.id]);
  }

}
