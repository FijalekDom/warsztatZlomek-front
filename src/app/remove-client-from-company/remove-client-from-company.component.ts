import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ClientCompany, GetClientData, UserData} from '../app.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-remove-client-from-company',
  templateUrl: './remove-client-from-company.component.html',
  styleUrls: ['./remove-client-from-company.component.css']
})
export class RemoveClientFromCompanyComponent implements OnInit {

  private client: UserData = null;
  constructor(private auth: AuthService) { }

  ngOnInit() {}
  getClient() {
    this.getClientData();
  }
  getClientData() {
    const username = $('#username').val();
    if (username === '') {
      return;
    }
    const form: GetClientData = {
    username: username,
    accessToken: this.auth.getAccessToken()
  };
    this.auth.getClientData(form).subscribe((result) => {
      this.auth.setExpirationDate();
      this.client = result;
    }, result => {
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
  }
  remove(i) {
    const form: ClientCompany = {
      accessToken: this.auth.getAccessToken(),
      companyName: this.client.companies[i].name,
      username: this.client.email
    };
    console.log(form);
    this.auth.removeClientFromCompany(form).subscribe(() => {
      this.auth.setExpirationDate();
      this.getClientData();
    }, result => {
      if (result.accessToken !== null) {
        this.auth.setExpirationDate();
      }
    });
  }
}
