import { Component, OnInit } from '@angular/core';
import {RemoveVisitModel, ShowVisitModel, TokenModel, VisitModel} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/operators';
import {visit} from '@angular/compiler-cli/src/ngtsc/util/src/visitor';


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
                  console.log(data);
                  this.visits = data.visits;
                  for (let i = 0; i < data.visits.length; i++) {
                      const date = new Date(data.visits[i].visitDate);
                      data.visits[i].visitDate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
                      + ' ' + date.getHours() + ':' + date.getMinutes();
                      switch (this.visits[i].visitStatus) {
                          case 'NEW': {this.visits[i].visitStatus = 'Nowa'; break; }
                          case 'ACCEPTED': {this.visits[i].visitStatus = 'Zaakceptowano'; break; }
                          case 'IN_PROGRESS': {this.visits[i].visitStatus = 'W toku'; break; }
                          case 'FOR_PICKUP': {this.visits[i].visitStatus = 'Do odbioru'; break; }
                          case 'FINISHED': {this.visits[i].visitStatus = 'Zakończona'; break; }
                      }
                  }
              },
              error => {
                  console.log(error);
              });
  }

  removeVisit(id: number) {
      const visit: RemoveVisitModel = {
        accessToken: JSON.parse(localStorage.getItem('currentUser')),
        visitId: id
      };

      if (confirm('Na pewno chcesz odwołać wizytę?') === true) {
          this.connection.removeVisit(visit)
              .pipe(first())
              .subscribe(
                  user => {
                      window.location.reload();
                  },
                  error => {
                      console.log(error);
                  });
      }
  }
}
