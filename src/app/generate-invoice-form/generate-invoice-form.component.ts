import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {InvoiceForm, InvoiceResponse} from '../app.component';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-generate-invoice-form',
  templateUrl: './generate-invoice-form.component.html',
  styleUrls: ['./generate-invoice-form.component.css']
})
export class GenerateInvoiceFormComponent implements OnInit {
  private submitted = false;
  private generateInvoiceForm: FormGroup;
  private invoice: InvoiceResponse;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }
  visitId: number;
  ngOnInit() {
    this.generateInvoiceForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      date: [null, Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]]
    });
    this.visitId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  get f() {
    return this.generateInvoiceForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    const methodOfPayment = $('#paymentMethod').val();
    if (this.generateInvoiceForm.invalid || methodOfPayment === '' || this.visitId === 0 ) {
      return;
    }
    let paymentDate = new Date(this.f.date.value);
    const generateInvoice: InvoiceForm = {
      accessToken: this.authService.getAccessToken(),
      discount: this.f.discount.value,
      methodOfPayment: methodOfPayment,
      paymentDate: paymentDate.getDate() + '-' + (paymentDate.getMonth() + 1) + '-' + paymentDate.getFullYear(),
      visitId: this.visitId,
      companyName: this.f.companyName.value
    };
    this.authService.generateInvoice(generateInvoice) .pipe(first())
      .subscribe(data => {
        this.authService.setExpirationDate();
        this.invoice = data.invoice;
        const dayOfIssue = new Date(this.invoice.dayOfIssue);
        this.invoice.dayOfIssue = dayOfIssue.getDate() + '-' + (dayOfIssue.getMonth() + 1) + '-' + dayOfIssue.getFullYear();
        paymentDate = new Date(this.invoice.paymentDate);
        this.invoice.paymentDate = paymentDate.getDate() + '-' + (paymentDate.getMonth() + 1) + '-' + paymentDate.getFullYear();
        console.log(this.invoice);
      });
  }
}
