import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {TokenModel, VisitModel} from '../../app.component';
import {first} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';
import {DateFormatter} from '@angular/common/src/pipes/deprecated/intl';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  visits: VisitModel[] = [];
  dates = [];
  constructor(
      private authservice: AuthService
  ) { }

  ngOnInit() {
      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.authservice.getAllClientVisits(token)
          .pipe(first())
          .subscribe(
              data => {
                  this.visits = data.visits;
                  this.convertDates();
                  console.log(this.visits);
              },
              error => {
                  console.log(error);
              });

  }

  convertDates() {
      this.visits.forEach((visit) => {

      });

  }

}
