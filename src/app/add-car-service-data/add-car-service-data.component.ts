import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AddCompanyModel} from '../app.component';

@Component({
  selector: 'app-add-car-service-data',
  templateUrl: './add-car-service-data.component.html',
  styleUrls: ['./add-car-service-data.component.css']
})
export class AddCarServiceDataComponent implements OnInit {
  private submitted = false;
  private addCarServiceForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) {}

  ngOnInit() {
    this.addCarServiceForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._-]{1,}@[a-z]{1,6}.[a-z]{2,3}')]],
      name: ['', Validators.required],
      nip: ['', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}')]],
      cityName: ['', [Validators.required, Validators.pattern('[A-ZŹĄĘÓŁŻ]{1}[a-z,ąęółńćźż]{2,}')]],
      streetName: ['', [Validators.required, Validators.pattern('[A-ZŹĄĘÓŁŻ]{1}[a-z,ąęółńćźż]{2,}')]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{3}')]],
      buildingNumber: [null, Validators.required],
      aptNum: [null]
    });
  }
  get f() {
    return this.addCarServiceForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.f.email.errors);
    const f = this.f;
    if (this.addCarServiceForm.invalid) {
      return;
    }
    const company: AddCompanyModel = {
      email: f.email.value,
      name: f.name.value,
      nip: f.nip.value,
      cityName: f.cityName.value,
      streetName: f.streetName.value,
      zipCode: f.zipCode.value,
      buildingNum: f.buildingNumber.value,
      aptNum: f.aptNum.value,
      accessToken: this.authService.getAccessToken()
    };
    this.authService.addCarService(company);
  }
}
