import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CarBrandModel} from '../app.component';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-add-car-brand',
  templateUrl: './add-car-brand.component.html',
  styleUrls: ['./add-car-brand.component.css']
})
export class AddCarBrandComponent implements OnInit {
  private submitted = false;
  private addCarBrandForm: FormGroup;
  constructor(private builder: FormBuilder,
              private service: AuthService) { }

  ngOnInit() {
    this.addCarBrandForm = this.builder.group({
      brandName: ['', Validators.required]
    });
  }

  get f() {
    return this.addCarBrandForm.controls;
  }

  submit() {
    this.submitted = true;
    console.log(this.f.brandName.errors);
    if (this.addCarBrandForm.invalid) {
      return;
    }
    const model: CarBrandModel = {
      brandName: this.f.brandName.value,
      accessToken: this.service.getAccessToken()
    };
    this.service.addCarBrand(model);
    this.ngOnInit();
  }
}
