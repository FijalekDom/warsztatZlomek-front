import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-logout-client',
  templateUrl: './logout-client.component.html',
  styleUrls: ['./logout-client.component.css']
})
export class LogoutClientComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.logout();
  }

}
