import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ShowEmployeeVisitModel, SubmitVisitModel, TokenModel, VisitModel} from '../app.component';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee-employees-visits',
  templateUrl: './employee-employees-visits.component.html',
  styleUrls: ['./employee-employees-visits.component.css']
})
export class EmployeeEmployeesVisitsComponent implements OnInit {

    visits: ShowEmployeeVisitModel[] = [];

    constructor(private connection: AuthService,
                private router: Router) { }

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
                        const month = date.getMonth() + 1;
                        data.visits[i].visitDate = date.getDate() + '-' + month + '-' + date.getFullYear();
                        this.visits[i].visitStatus = this.convertStatus(this.visits[i].visitStatus);
                    }
                },
                error => {
                    console.log(error);
                }
            );
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

    showMore(i: number) {
        this.router.navigate(['employee/account/showVisitDetails', this.visits[i].id]);
    }
}
