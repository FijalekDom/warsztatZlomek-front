import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginModel} from '../app.component';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

// import {request} from 'http';

@Component({
  selector: 'app-employee-sign-in-component',
  templateUrl: './employee-sign-in-component.component.html',
  styleUrls: ['./employee-sign-in-component.component.css']
})
export class EmployeeSignInComponentComponent implements OnInit {

  employeeSignInForm: FormGroup;
  private submitted = false;
  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.employeeSignInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._-]{1,}@[a-z]{1,6}.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9ĄŻŹÓŁĘążźćńłóę!@#%*\^]{6,20}')]]
    });
  }

  get f() {
    return this.employeeSignInForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.employeeSignInForm.invalid){
      return;
    }
    const loginModel: LoginModel = {
      email: this.f.email.value,
      password: this.f.password.value
    };
    this.authService.loginEmployee(loginModel).pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/employee/account']);
        },
        error1 => {
          console.log('error');
        });

  }

}
