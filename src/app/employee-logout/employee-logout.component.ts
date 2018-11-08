import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-employee-logout',
  templateUrl: './employee-logout.component.html',
  styleUrls: ['./employee-logout.component.css']
})
export class EmployeeLogoutComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.logoutEmployee();

  }

}
