import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../auth.service';
import {CarHasCompanyModel, CompanyModel, TokenModel} from '../../../app.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-car-rm-company',
  templateUrl: './car-rm-company.component.html',
  styleUrls: ['./car-rm-company.component.css']
})
export class CarRmCompanyComponent implements OnInit {
    @Input()
    id: number;
    rmForm: FormGroup;
    loading = false;
    submitted = false;
    companies: CompanyModel[] = [];
    companyId = 0;
    selectError = false;

  constructor(
      private connection: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      const token: TokenModel = {
          accessToken: JSON.parse(localStorage.getItem('currentUser'))
      };

      this.connection.getClientsCompanies(token)
          .pipe(first())
          .subscribe(
              data => {
                  this.companies = data.companies;
                  console.log(data.companies);
              },
              error => {
                  console.log(error);
              }
          );
      console.log(this.companies);

      this.rmForm = this.formBuilder.group({
          companyName: [],
      });
  }

  get f() { return this.rmForm.controls; }

  onSubmit() {
      this.submitted = true;

      for ( const company of this.companies) {
          if (company.name === this.f.companyName.value) {
              this.companyId = company.id;
          }
      }

      if (this.companyId !== 0) {
          this.loading = true;

          const company: CarHasCompanyModel = {
              accessToken: JSON.parse(localStorage.getItem('currentUser')),
              carId: this.id,
              companyId: this.companyId
          };

          this.connection.removeCarFromCompany(company)
              .pipe(first())
              .subscribe( user => {
                      this.loading = false;
                      window.location.reload();
                  },
                  error => {
                      console.log(error);
                      this.loading = false;
                  });

      } else {
          this.selectError = true;
      }
  }

}
