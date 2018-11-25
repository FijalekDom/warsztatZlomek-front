import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {RegisterModel} from '../app.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css']
})
export class RegisterClientComponent implements OnInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;


  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{8}')]],
            cityName: ['', Validators.required],
            streetName: ['', Validators.required],
            buildNum: ['', Validators.required],
            aptNum: ['', Validators.pattern('[0-9]*')],
            zipCode: ['', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{3}')]],
            password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9ĄŻŹÓŁĘążźćńłóę!@#%*^]{6,20}')]],
            confirmPassword: ['', [Validators.required, Validators.pattern('[A-Za-z0-9ĄŻŹÓŁĘążźćńłóę!@#%*^]{6,20}')]]
        });
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        const registrationModel: RegisterModel = {
            firstName: this.f.firstName.value,
            lastName: this.f.lastName.value,
            email: this.f.email.value,
            phoneNumber: this.f.phoneNumber.value,
            cityName: this.f.cityName.value,
            streetName: this.f.streetName.value,
            buildNum: this.f.buildNum.value,
            aptNum: this.f.aptNum.value,
            zipCode: this.f.zipCode.value,
            password: this.f.password.value,
            confirmPassword: this.f.confirmPassword.value,
        };

        console.log(registrationModel);

        this.loading = true;

        this.authService.register(registrationModel)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                },
                error => {
                    this.loading = false;
                });

    }

}
