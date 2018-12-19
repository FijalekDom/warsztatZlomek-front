import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {AddCarModel, CarEditModel, CarIdModel, CarModel, CoownerModel, TokenModel} from '../../app.component';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
   tableIndex: number;
   carId: number;
   addCarForm: FormGroup;
   loading = false;
   submitted = false;
   cars: CarModel[] = [];
   formDisable = false;
   managementDisable = false;
   carsBrands = [];


  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService
  ) { }

  ngOnInit() {
      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.authService.getCars(token)
          .pipe(first())
          .subscribe(
              data => {
                  console.log(data);
                  this.cars = data.cars;
              },
              error => {
                  console.log(error);
              });
  }

  showForm(id: number, index: number) {
      this.formDisable = true;
      this.carId = id;
      this.tableIndex = index;

      this.addCarForm = this.formBuilder.group({
          carBrand: [],
          model: ['', Validators.required],
          registrationNumber: ['', [Validators.required, Validators.pattern('[A-Z]{1,3}\\s[0-9 A-Z]{4,5}')]],
          vin: ['', [Validators.required, Validators.pattern('[0-9]{17}')]],
          productionYear: ['', [Validators.required, Validators.pattern('[0-9]{4}')]]
      });

      this.authService.getCarBrands()
          .pipe(first())
          .subscribe(
              brands => {
                  this.carsBrands = brands.brandNames;
              },
                error => {
                  console.log(error);
                }
          );
  }

  showManagement(id: number) {
      this.managementDisable = true;
      this.carId = id;
  }


  get f() { return this.addCarForm.controls; }

  onSubmit(id: number) {
      this.submitted = true;

      if (this.addCarForm.invalid) {
          return;
      }

      if (id !== 0) {
        this.editCar(id);
      } else {
         this.newCar();
      }

  }

  editCar(id: number) {
      const car: CarEditModel = {
          brandName: this.f.carBrand.value,
          model: this.f.model.value,
          registrationNumber: this.f.registrationNumber.value,
          vin: this.f.vin.value,
          productionYear: this.f.productionYear.value,
          accessToken: JSON.parse(localStorage.getItem('currentUser')),
          carId: id
      };

      this.loading = true;

      this.authService.editCar(car)
          .pipe(first())
          .subscribe(
              user => {
                  this.loading = false;
                  this.ngOnInit();
              },
              error => {
                  console.log(error);
                  this.loading = false;
              });
  }

  newCar() {
      const car: AddCarModel = {
          brandName: this.f.carBrand.value,
          model: this.f.model.value,
          registrationNumber: this.f.registrationNumber.value,
          vin: this.f.vin.value,
          productionYear: this.f.productionYear.value,
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.loading = true;

      this.authService.addCar(car)
          .pipe(first())
          .subscribe(
              user => {
                  this.loading = false;
                  this.formDisable = false;
                  this.ngOnInit();
              },
              error => {
                  console.log(error);
                  this.loading = false;
              });
  }

  deleteCar(id: number) {
      const idData: CarIdModel = {
          carId: id,
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };
        console.log(idData);
      this.authService.deleteCar(idData)
          .pipe(first())
          .subscribe( user => {
                  this.ngOnInit();
              },
              error => {
                  console.log(error);
              });
  }

   coverForm() {
        this.formDisable = false;
   }

    coverManagement() {
        this.managementDisable = false;
    }

}
