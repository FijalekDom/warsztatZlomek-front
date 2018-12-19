import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {VisitResponse} from '../app.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-check-car-by-vin',
  templateUrl: './check-car-by-vin.component.html',
  styleUrls: ['./check-car-by-vin.component.css']
})
export class CheckCarByVinComponent implements OnInit {
  private checkCar: FormGroup;
  private submitted = false;
  private visits: VisitResponse[] = [];
  constructor(private formBuilder: FormBuilder,
              private auth: AuthService) { }

  ngOnInit() {
    this.checkCar = this.formBuilder.group({
      vin: ['', [Validators.required, Validators.pattern('[A-Z0-9]{17}')]]
    });
  }
  get f() {
    return this.checkCar.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.checkCar.invalid) {
      return;
    }
    const form = {
      vin: this.f.vin.value
    };
    this.auth.checkCar(form).subscribe((result) => {
      this.visits = result.visits;
      for (let i = 0; i < this.visits.length; i++) {
        const date = new Date(parseInt(this.visits[i].visitDate, 10));
        this.visits[i].visitDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      }
    }, (result) => {
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
  }

  toggle(i: number) {
    $('#' + i).toggle();
  }
}
