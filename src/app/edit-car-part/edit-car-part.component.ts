import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {CarPartModel, CarPartResponse} from '../app.component';

@Component({
  selector: 'app-edit-car-part',
  templateUrl: './edit-car-part.component.html',
  styleUrls: ['./edit-car-part.component.css']
})
export class EditCarPartComponent implements OnInit {

  private editCarPartForm: FormGroup;
  constructor(private builder: FormBuilder,
              private service: AuthService) { }
  private carParts: CarPartResponse[];
  ngOnInit() {
    // do dopisania
    this.editCarPartForm = this.builder.group({
      producerName: ['', Validators.required],
      partName: ['', Validators.required],
      tax: [0, [Validators.min(0), Validators.max(25)]]
    });
  }

  get f() {
    return this.editCarPartForm.controls;
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
