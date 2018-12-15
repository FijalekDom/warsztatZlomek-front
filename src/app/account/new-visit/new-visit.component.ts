import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddVisitModel, CarModel, TokenModel} from '../../app.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {

    carId: number;
    addVisitForm: FormGroup;
    loading = false;
    submitted = false;
    cars: CarModel[] = [];

  constructor(
      private connection: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.addVisitForm = this.formBuilder.group({
          carId: ['', Validators.required],
          visitDate: ['', Validators.required],
          isOverview: ['', Validators.required],
          });

      this.connection.getCars(token)
          .pipe(first())
          .subscribe(
              data => {
                  this.cars = data.cars;
              },
              error => {
                  console.log(error);
              });
  }

  get f() { return this.addVisitForm.controls; }

  onSubmit() {
      this.submitted = true;

      if (this.addVisitForm.invalid) {
          return;
      }

      const date = new Date(this.f.visitDate.value);
      const visit: AddVisitModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser')),
          carId: this.f.carId.value,
          visitDate: date.getDate() + '-' + (date.getMonth() + 1) + '-'
          + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
          isOverview: this.f.isOverview.value
      };

      this.loading = true;

      console.log(visit);

      this.connection.addVisit(visit)
          .pipe(first())
          .subscribe(
              user => {
                  this.loading = false;
                  alert('Dodano wizytę!!!');
                  window.location.reload();
              },
              error => {
                  console.log(error);
                  this.loading = false;
              });
  }

}
