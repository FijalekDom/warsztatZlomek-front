import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {CompanyModel, InvoiceForm, InvoiceResponse, TokenModel} from '../app.component';
import {AuthService} from '../auth.service';
import {GeneratePDFService} from '../generate-pdf.service';

@Component({
  selector: 'app-generate-invoice-form',
  templateUrl: './generate-invoice-form.component.html',
  styleUrls: ['./generate-invoice-form.component.css']
})
export class GenerateInvoiceFormComponent implements OnInit {

  private submitted = false;
  private generateInvoiceForm: FormGroup;
  private invoice: InvoiceResponse;
  private companiesNames: CompanyModel;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private pdf: GeneratePDFService) {
  }

  visitId: number;


  ngOnInit() {
    this.generateInvoiceForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      date: [null, Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]]
    });
    this.visitId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    const token: TokenModel = {
       accessToken: this.authService.getAccessToken()
    };
    this.authService.getCompanies(token).
      pipe(first())
          .subscribe(
              data => {
                  this.authService.setExpirationDate();
                  this.companiesNames = data.companies;
                  console.log(this.companiesNames);
              },
          error => {
              if (error.accessToken !== null) {
                  this.authService.setExpirationDate();
              }
          });

  }

  get f() {
    return this.generateInvoiceForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    const methodOfPayment = $('#paymentMethod').val();
    if (this.generateInvoiceForm.invalid || methodOfPayment === '' || this.visitId === 0) {
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

    let url: string;
    let invoice: string;
    if (this.router.url.includes('ProForma')) {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addProFormaInvoice';
      invoice = 'ProForma';
    } else {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addInvoice';
      invoice = 'VAT';
    }
    console.log(generateInvoice);
    this.authService.generateInvoice(generateInvoice, url).pipe(first())
      .subscribe(data => {
        this.authService.setExpirationDate();
        this.invoice = data.invoice;
        const dayOfIssue = new Date(this.invoice.dayOfIssue);
        this.invoice.dayOfIssue = dayOfIssue.getDate() + '-' + (dayOfIssue.getMonth() + 1) + '-' + dayOfIssue.getFullYear();
        paymentDate = new Date(this.invoice.paymentDate);
        this.invoice.paymentDate = paymentDate.getDate() + '-' + (paymentDate.getMonth() + 1) + '-' + paymentDate.getFullYear();
        const finishDate = new Date(data.invoice.serviceFinishDate);
        this.invoice.serviceFinishDate = finishDate.getDate() + '-' + (finishDate.getMonth() + 1) + '-' + finishDate.getFullYear();
        if (invoice === 'VAT') {
            this.pdf.makePDF(this.invoice);
        } else {
            this.pdf.makeProForma(this.invoice);
        }

      }, result => {
        if (result.accessToken !== null) {
          this.authService.setExpirationDate();
        }
      });
  }
}
