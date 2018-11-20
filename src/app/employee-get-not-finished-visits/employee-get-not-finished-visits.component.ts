import { Component, OnInit } from '@angular/core';
import {
    CarPartEditVisitModel, CarPartModel, CarPartResponse, ServiceEditVisitModel, ServiceModel, ShowEmployeeVisitModel, SubmitVisitModel,
    TokenModel,
    VisitModel
} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-employee-get-not-finished-visits',
  templateUrl: './employee-get-not-finished-visits.component.html',
  styleUrls: ['./employee-get-not-finished-visits.component.css']
})
export class EmployeeGetNotFinishedVisitsComponent implements OnInit {

  showList = true;
  visits: ShowEmployeeVisitModel[] = [];
  carParts: CarPartEditVisitModel[] = [];
  services: ServiceEditVisitModel[] = [];
  servicesList: ServiceModel[] = [];
  carPartsList: CarPartResponse[] = [];
  addCarPartForm: FormGroup;
  addServiceForm: FormGroup;
  private id: number;

  constructor(
      private formBuilder: FormBuilder,
      private connection: AuthService) { }

  ngOnInit() {
    const token: TokenModel = {
      accessToken: this.connection.getAccessToken()
    };

    this.connection.getNotFinishedVisits(token)
        .pipe(first())
        .subscribe(
            data => {
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

  submitPickup(id: number) {
    this.showList = false;
    this.id = id;

    this.connection.getEditVisitData()
        .pipe(first())
        .subscribe(
            data => {
                console.log(data);
                this.carPartsList = data.parts;
                this.servicesList = data.services;
            },
            error => {
                console.log(error);
            }
        );

      this.addCarPartForm = this.formBuilder.group({
          part: ['', Validators.required],
          price: ['', Validators.required],
          count: ['', Validators.required],
      });

      this.addServiceForm = this.formBuilder.group({
          service: ['', Validators.required],
          servicePrice: ['', Validators.required],
          serviceCount: ['', Validators.required],
      });

  }

  get f() {
     return this.addCarPartForm.controls;
  }

  pushPart() {
      const part: CarPartEditVisitModel = {
          id: this.f.part.value,
          price: this.f.price.value,
          count: this.f.count.value,
      };

      console.log(part);

      this.carParts.push(part);
  }

    get g() {
        return this.addServiceForm.controls;
    }

  pushService() {
    const serviceId = this.g.service.value - 1;

    const service: ServiceEditVisitModel = {
        name: this.servicesList[serviceId].name,
        price: this.g.servicePrice.value,
        count: this.g.serviceCount.value,
    };

    this.services.push(service);
  }

  changeStatus(id: number, status: String) {
        const visit: SubmitVisitModel = {
            accessToken: this.connection.getAccessToken(),
            visitId: id,
            carParts: [],
            services: [],
            countYears: null,
            status: status
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

    sendRequest() {
        const visit: SubmitVisitModel = {
            visitId: this.id,
            carParts: this.carParts,
            services: this.services,
            countYears: null,
            status: 'for pickup',
            accessToken:  this.connection.getAccessToken()
        };

        console.log(visit);

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
}
