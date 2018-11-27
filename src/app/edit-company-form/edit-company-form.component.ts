import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AddCompanyModel, CompanyModel, EditCompanyModel} from '../app.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-company-form',
  templateUrl: './edit-company-form.component.html',
  styleUrls: ['./edit-company-form.component.css']
})
export class EditCompanyFormComponent implements OnInit {
  private submitted = false;
  private editCompanyForm: FormGroup;
  private company: CompanyModel;
  constructor(private builder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.editCompanyForm = this.builder.group({
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._-]{1,}@[a-z]{1,6}.[a-z]{2,3}')]],
      name: ['', Validators.required],
      nip: ['', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}')]],
      cityName: ['', [Validators.required, Validators.pattern('[A-ZŹĄĘÓŁŻ]{1}[a-z,ąęółńćźż]{2,}')]],
      streetName: ['', [Validators.required, Validators.pattern('[A-ZŹĄĘÓŁŻ]{1}[a-z,ąęółńćźż]{2,}')]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{3}')]],
      buildingNumber: [0, Validators.required],
      aptNum: [null]
    });
    const companyId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.authService.getCompanyById(companyId).subscribe((result) => {
      this.authService.setExpirationDate();
      this.company = result;
    }, result => {
      if (result.accessToken !== null) {
        this.authService.setExpirationDate();
      }
    });
  }

  get f() {
    return this.editCompanyForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    const f = this.f;
    if (this.editCompanyForm.invalid) {
      return;
    }
    const company: EditCompanyModel = {
      email: f.email.value,
      name: f.name.value,
      nip: f.nip.value,
      cityName: f.cityName.value,
      streetName: f.streetName.value,
      zipCode: f.zipCode.value,
      buildingNum: f.buildingNumber.value,
      aptNum: f.aptNum.value,
      accessToken: this.authService.getAccessToken(),
      id: this.company.id
    };
    this.authService.editCompany(company);
  }

}
