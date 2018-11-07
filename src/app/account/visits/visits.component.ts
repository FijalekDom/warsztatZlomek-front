import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {

  constructor(
      private authservice: AuthService,
  ) { }

  ngOnInit() {

  }

}
