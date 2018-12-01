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
      this.visit.visitStatus = this.convertStatus(this.visit.visitStatus);
      this.auth.setExpirationDate();
      console.log(this.visit);
    }, (result) => {
      console.log(result);
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
  }

  convertStatus(status) {
    switch (status) {
        case 'NEW': { return 'Nowa'; break; }
        case 'ACCEPTED': { return 'Zaakceptowano'; break; }
        case 'IN_PROGRESS': { return 'W toku'; break; }
        case 'FOR_PICKUP': { return 'Do odbioru'; break; }
        case 'FINISHED': { return 'Zakończona'; break; }
        default: { return null; break; }
    }
  }

  createInvoice () {
    this.router.navigate(['employee/account/generateInvoiceForm', this.visit.id]);
  }

}
