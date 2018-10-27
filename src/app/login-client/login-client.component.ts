import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {LoginModel} from '../app.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.css']
})
export class LoginClientComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      this.authService.logout();

      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        const loginM: LoginModel = ({
            username: this.f.username.value,
            password: this.f.password.value
        });

        this.loading = true;
        this.authService.login(loginM)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.loading = false;
                });
    }

}
