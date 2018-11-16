import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {TokenModel, VisitModel} from '../app.component';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-employee-get-new-visits',
  templateUrl: './employee-get-new-visits.component.html',
  styleUrls: ['./employee-get-new-visits.component.css']
})
export class EmployeeGetNewVisitsComponent implements OnInit {


    visits: VisitModel[] = [];

    constructor(private connection: AuthService) { }

    ngOnInit() {
        const token: TokenModel = {
            accessToken: this.connection.getAccessToken()
        };

        this.connection.getNewVisits(token)
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
                }
            );
    }

}
