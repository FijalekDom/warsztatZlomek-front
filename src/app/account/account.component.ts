import { Component, OnInit } from '@angular/core';
import {ShowVisitModel, TokenModel, VisitModel} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  visits: ShowVisitModel[] = [];

  constructor(
      private connection: AuthService
  ) { }

  ngOnInit() {
      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.connection.getFutureVisits(token)
          .pipe(first())
          .subscribe(
              data => {
                  this.visits = data.visits;
                  for (let i = 0; i < data.visits.length; i++) {
                      const date = new Date(data.visits[i].visitDate);
                      data.visits[i].visitDate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
                  }
              },
              error => {
                  console.log(error);
              });
  }



}
