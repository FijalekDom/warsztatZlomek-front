import {Component, OnInit} from '@angular/core';
import {
    CarPartEditVisitModel, CarPartModel, CarPartResponse, ServiceEditVisitModel, ServiceModel, ShowEmployeeVisitModel, SubmitVisitModel,
    TokenModel, UserData, VerificationModel,
    VisitModel, VisitResponse, VisitResponseOverview
} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-employee-get-not-finished-visits',
  templateUrl: './employee-get-not-finished-visits.component.html',
  styleUrls: ['./employee-get-not-finished-visits.component.css']
})
export class EmployeeGetNotFinishedVisitsComponent implements OnInit {
  i: number;
  showList = true;
  visits: VisitResponseOverview[] = [];
  carParts: CarPartEditVisitModel[] = [];
  services: ServiceEditVisitModel[] = [];
  servicesList: ServiceModel[] = [];
  carPartsList: CarPartResponse[] = [];
  addCarPartForm: FormGroup;
  addServiceForm: FormGroup;
  addDateForm: FormGroup;
  private id: number;
  private owners: UserData[] = [];
  private notVerified: UserData[] = [];
  constructor(
  private formBuilder: FormBuilder,

  private connection: AuthService) {
  }

  ngOnInit() {
    const token: TokenModel = {
      accessToken: this.connection.getAccessToken()
    };

    this.connection.getNotFinishedVisits(token)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.connection.setExpirationDate();
          this.visits = data.visits;
          for (let i = 0; i < data.visits.length; i++) {
            const date = new Date(data.visits[i].visitDate);
            data.visits[i].visitDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
          }
          console.log(this.visits);
        },
        error => {
          if (error.accessToken !== null) {
            this.connection.setExpirationDate();
          }
        }
      );
  }

  cancel() {
      this.showList = true;
      this.i = 0;
  }

  submitPickup(id: number) {
    this.showList = false;
    this.id = this.visits[id].id;
    this.i = id;

    this.connection.getEditVisitData()
      .pipe(first())
      .subscribe(
        data => {
          this.carPartsList = data.parts;
          this.servicesList = data.services;
        },
        error => {
          if (error.accessToken !== null) {
            this.connection.setExpirationDate();
          }
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

    this.addDateForm = this.formBuilder.group({
        expirationDate: ['', Validators.required],
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

  get dateControls() {
    return this.addDateForm.controls;
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
          window.location.reload();
        },
        error => {
          console.log(error);
        }
      );
  }

  sendRequest() {
    this.owners = [];
    this.notVerified = [];
    const visit: SubmitVisitModel = {
            visitId: this.id,
            carParts: this.carParts,
            services: this.services,
            countYears: null,
            status: 'for pickup',
            accessToken: this.connection.getAccessToken()
        };

    console.log('aaaa');

    if (this.checkOwnership()) {
      const form: VerificationModel = {
        accessToken: this.connection.getAccessToken(),
        car: this.visits[this.i].car,
        notOwners: this.notVerified,
        owners: this.owners
      };
      this.connection.verifyOwnership(form).subscribe(result => {
        console.log(result);
        this.connection.setExpirationDate();
      }, result => {
        if (result.accessToken !== null) {
          this.connection.setExpirationDate();
        }
      });
    } else if (this.visits[this.i].notVerifiedOwners.length !== 0) {
      return;
    }

    console.log(visit);

    this.connection.editVisit(visit)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          alert('Udało się!');
        },
        error => {
          console.log(error);
        }
      );
  }

  checkOwnership(): boolean {
    const nvo = this.visits[this.i].notVerifiedOwners;
    for (let i = 0; i < nvo.length; i++) {
      if ($('#nv' + i).prop('checked')) {
        this.owners.push(nvo[i]);
      } else {
        this.notVerified.push(nvo[i]);
      }
    }
    const vo = this.visits[this.i].owners;
    for (let i = 0; i < vo.length; i++) {
      if ($('#v' + i).prop('checked')) {
        this.owners.push(vo[i]);
      } else {
        this.notVerified.push(vo[i]);
      }
    }
    return this.owners.length !== 0;
  }
}
