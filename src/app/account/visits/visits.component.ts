import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {TokenModel} from '../../app.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {

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
                  console.log(data);
              },
              error => {
                  console.log(error);
              });

  }

}
