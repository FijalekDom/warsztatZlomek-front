import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {RegisterEmployeeModel, RemoveEmployeeModel} from '../app.component';

@Component({
  selector: 'app-remove-employee',
  templateUrl: './remove-employee.component.html',
  styleUrls: ['./remove-employee.component.css']
})
export class RemoveEmployeeComponent implements OnInit {
  private removeEmployeeForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.removeEmployeeForm = this.formBuilder.group({
      email: ['', Validators.pattern('^[A-Za-z0-9._-]{1,}@[a-z]{1,6}.[a-z]{2,3}$')],
      quitDate: ['', Validators.required]
    });
  }

  get f() {
    return this.removeEmployeeForm.controls;
  }

  submit() {
    const date = new Date(this.f.quitDate.value);
    const removeEmployeeModel: RemoveEmployeeModel = {
      employeeMail: this.f.email.value,
      quitDate: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
      accessToken: this.authService.getAccessToken()
    };
    this.authService.removeEmployee(removeEmployeeModel);
  }

}
