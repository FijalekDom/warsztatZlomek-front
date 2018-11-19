import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ShowEmployeeVisitModel, SubmitVisitModel, TokenModel, VisitModel} from '../app.component';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-employee-employees-visits',
  templateUrl: './employee-employees-visits.component.html',
  styleUrls: ['./employee-employees-visits.component.css']
})
export class EmployeeEmployeesVisitsComponent implements OnInit {

    visits: ShowEmployeeVisitModel[] = [];

    constructor(private connection: AuthService) { }

    ngOnInit() {
        const token: TokenModel = {
            accessToken: this.connection.getAccessToken()
        };

        this.connection.getEmployeesVisits(token)
            .pipe(first())
            .subscribe(
                data => {
                  this.connection.setExpirationDate();
                    console.log(data);
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

    confirmReceival(id: number) {
        const visit: SubmitVisitModel = {
            accessToken: this.connection.getAccessToken(),
            visitId: id,
            carParts: [],
            services: [],
            countYears: null,
            status: 'in progress'
        };

        this.connection.editVisit(visit)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    console.log(error);
                }
            );
    }

    changeStatus(id: number, status: String) {
        const visit: SubmitVisitModel = {
            accessToken: this.connection.getAccessToken(),
            visitId: id,
            carParts: [],
            services: [],
            countYears: null,
            status: 'for pickup'
        };

        this.connection.editVisit(visit)
            .pipe(first())
            .subscribe(
                data => {
                  this.connection.setExpirationDate();
                    console.log(data);
                },
                error => {
                    console.log(error);
                }
            );
    }

}
