import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {ClientUpdateModel, TokenModel, UserData} from '../../app.component';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-client-account',
  templateUrl: './client-account.component.html',
  styleUrls: ['./client-account.component.css']
})
export class ClientAccountComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    userData: UserData;
    formDisable = false;

  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.formDisable = false;

      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

    this.authService.getAccountData(token)
        .pipe(first())
        .subscribe(
            data => {
                console.log(data);
                this.userData = data;
                console.log(this.userData);
            },
            error => {
                console.log(error);
            });

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
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      });
  }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        const client: ClientUpdateModel = {
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
            accessToken: JSON.parse(localStorage.getItem('currentUser'))
        };

        this.loading = true;

        this.authService.updateClientData(client)
            .pipe(first())
            .subscribe(
                user => {
                    console.log(user);
                    this.loading = false;
                },
                error => {
                    console.log(error);
                    this.loading = false;
                });
    }

  showForm() {
      this.formDisable = true;
  }

  cancelEdit() {
      this.formDisable = false;
  }

  deleteAccount() {

      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      if (confirm('Na pewno chcesz usunąć konto?') == true) {
          this.authService.deleteUser(token)
              .pipe(first())
              .subscribe(
                  user => {
                      console.log(user);
                      this.loading = false;
                      this.router.navigate(['/logout']);
                  },
                  error => {
                      console.log(error);
                      this.loading = false;
                  });
      }
  }

}
