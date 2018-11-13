import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {CarBrandModel, CarPartModel} from '../app.component';

@Component({
  selector: 'app-add-car-part',
  templateUrl: './add-car-part.component.html',
  styleUrls: ['./add-car-part.component.css']
})
export class AddCarPartComponent implements OnInit {

  private addCarPartForm: FormGroup;
  constructor(private builder: FormBuilder,
              private service: AuthService) { }

  ngOnInit() {
    this.addCarPartForm = this.builder.group({
      producerName: ['', Validators.required],
      partName: ['', Validators.required],
      tax: [0, [Validators.min(0), Validators.max(25)]]
    });
  }

  get f() {
    return this.addCarPartForm.controls;
  }

  submit() {
    if (this.f.partName.errors || this.f.producerName.errors || this.f.tax.errors) {
      return;
    }
    const model: CarPartModel = {
      name: this.f.partName.value,
      tax: this.f.tax.value,
      producer: this.f.producerName.value,
      accessToken: this.service.getAccessToken()
    };
    this.service.addCarPart(model);
  }
}
