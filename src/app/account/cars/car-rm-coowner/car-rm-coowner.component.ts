import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../auth.service';
import {first} from 'rxjs/operators';
import {CoownerModel} from '../../../app.component';

@Component({
  selector: 'app-car-rm-coowner',
  templateUrl: './car-rm-coowner.component.html',
  styleUrls: ['./car-rm-coowner.component.css']
})
export class CarRmCoownerComponent implements OnInit {
 @Input()
  id: number;
  rmForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private connection: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      this.rmForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
      });
  }

  get f() { return this.rmForm.controls; }

  removeCoowner() {
      this.submitted = true;

      if (this.rmForm.invalid) {
          return;
      }

      const coowner: CoownerModel = {
          carId: this.id,
          coownerUsername: this.f.email.value,
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.loading = true

      console.log(coowner);

      this.connection.removeCoowner(coowner)
          .pipe(first())
          .subscribe(
              user => {
                  this.loading = false;
                  window.location.reload();
              },
              error => {
                  console.log(error);
                  this.loading = false;
              }
          );

  }
}
