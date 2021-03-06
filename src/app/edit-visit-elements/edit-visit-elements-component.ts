import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {CarPartModel, CarPartResponse, EditCarPartModel, ServiceModel} from '../app.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit-visit-elements',
  templateUrl: './edit-visit-elements-component.html',
  styleUrls: ['./edit-visit-elements-component.css']
})
export class EditVisitElementsComponent implements OnInit {
  private submitted = false;
  private serviceSubmitted = false;
  private selectedValue = '-1';
  private editCarPartForm: FormGroup;
  constructor(private builder: FormBuilder,
              private auth: AuthService) { }
  private carParts: CarPartResponse[] = [];
  private services: ServiceModel[] = [];
  private carPart: CarPartResponse;
  private service: ServiceModel;
  private editServiceForm: FormGroup;
  private selectedService = '-1';
  ngOnInit() {
    this.auth.getVisitElements().subscribe((result) => {
      this.carParts = result.parts;
      this.services = result.services;
    }, result => {
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
    this.editCarPartForm = this.builder.group({
      producerName: ['', Validators.required],
      partName: ['', Validators.required],
      tax: [0, [Validators.min(0), Validators.max(25)]]
    });
    this.editServiceForm = this.builder.group({
      serviceName: ['', Validators.required],
      serviceTax: [0, Validators.required]
    });
  }


  get f() {
    return this.editCarPartForm.controls;
  }

  get g() {
    return this.editServiceForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.editCarPartForm.invalid) {
      return;
    }
    const model: EditCarPartModel = {
      name: this.f.partName.value,
      tax: this.f.tax.value,
      producer: this.f.producerName.value,
      accessToken: this.auth.getAccessToken(),
      id: this.carPart.id
    };
    this.auth.editCarPart(model);
  }

  showCarPartsForm() {
    this.selectedValue = $('#part').val();
    this.carPart = this.carParts[this.selectedValue];
    console.log(this.carPart);
  }

  showServicesForm() {
    this.selectedService = $('#service').val();
    this.service = this.services[this.selectedService];
  }

  submitServicesForm() {
    this.serviceSubmitted = true;
    if (this.editServiceForm.invalid) {
      return;
    }
    const model: ServiceModel = {
      name: this.g.serviceName.value,
      tax: this.g.serviceTax.value,
      accessToken: this.auth.getAccessToken(),
      id: this.service.id
    };
    this.auth.editService(model);
  }
}
