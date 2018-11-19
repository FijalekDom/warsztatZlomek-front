import { Component, OnInit } from '@angular/core';
import {TokenModel, VisitModel} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-employee-get-not-finished-visits',
  templateUrl: './employee-get-not-finished-visits.component.html',
  styleUrls: ['./employee-get-not-finished-visits.component.css']
})
export class EmployeeGetNotFinishedVisitsComponent implements OnInit {

  visits: VisitModel[] = [];

  constructor(private connection: AuthService) { }

  ngOnInit() {
    const token: TokenModel = {
      accessToken: this.connection.getAccessToken()
    };

    this.connection.getNotFinishedVisits(token)
        .pipe(first())
        .subscribe(
            data => {
              this.connection.setExpirationDate();
                this.visits = data.visits;
                for (let i = 0; i < data.visits.length; i++) {
                    const date = new Date(data.visits[i].visitDate);
                    data.visits[i].visitDate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
                }
            },
            error => {
              console.log(error);
            }
        );
  }

}
