import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {InvoiceForm, InvoiceResponse} from '../app.component';
import {AuthService} from '../auth.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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
              private authService: AuthService) {
  }

  visitId: number;
  private pdf: {};


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
    if (this.router.url.includes('ProForma')) {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addProFormaInvoice';
    } else {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addInvoice';
    }
    this.authService.generateInvoice(generateInvoice, url).pipe(first())
      .subscribe(data => {
        this.authService.setExpirationDate();
        this.invoice = data.invoice;
        const dayOfIssue = new Date(this.invoice.dayOfIssue);
        this.invoice.dayOfIssue = dayOfIssue.getDate() + '-' + (dayOfIssue.getMonth() + 1) + '-' + dayOfIssue.getFullYear();
        paymentDate = new Date(this.invoice.paymentDate);
        this.invoice.paymentDate = paymentDate.getDate() + '-' + (paymentDate.getMonth() + 1) + '-' + paymentDate.getFullYear();
        console.log(this.invoice);
        this.makePDF();
      });
  }

  makePDF() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.pdf = {
          content: [
              { text: 'Faktura VAT nr ' + this.invoice.invoiceNumber, style: 'header' },
              { text: 'Oryginał', style: 'bold' },
              { text: 'Data wystawienia: ' + this.invoice.dayOfIssue, style: ['anotherStyle']},
              { text: 'Data sprzedaży: ', style: ['anotherStyle']},
              { text: 'Termin zapłaty: ' + this.invoice.paymentDate, style: ['anotherStyle']},
              { text: ''},
              {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3}], margin: [0,20,0,0]},
              { columns: [
                      [
                          { text: 'Sprzedawca: ', bold: true},
                          { text: this.invoice.carServiceData.name },
                          { text: 'ul.' + this.invoice.carServiceData.streetName + ' ' + this.invoice.carServiceData.buildingNum },
                          { text: this.invoice.carServiceData.zipCode + ' ' + this.invoice.carServiceData.cityName },
                          { text: 'NIP' + this.invoice.carServiceData.nip }
                      ],
                      [
                          { text: 'Nabywca: ', bold: true},
                          { text: this.invoice.companyData.name},
                          { text: 'ul.' + this.invoice.companyData.streetName + ' ' + this.invoice.companyData.buildingNum},
                          { text: this.invoice.companyData.zipCode + ' ' + this.invoice.companyData.cityName },
                          { text: 'NIP' + this.invoice.companyData.nip }
                      ]
                  ],  margin: [ 0, 20, 0, 0 ]
              },
              { table: {
                      body: this.buildTableBody()
                  },
                  margin: [0,20,0,0],
                  widths: ['5%', '20%', '15%', '15%', '15%', '15%']
              },
          ],
          styles: {
              header: {
                  fontSize: 22,
                  bold: true
              },
              anotherStyle: {
                  italics: true,
                  alignment: 'right'
              }
          }
      };
      pdfMake.createPdf(this.pdf).download();
  }

  buildTableBody () {
        let i = 0;
        const body = [
            [ { text: 'Nr', fillColor: '#eeeeee'},
                { text: 'Nazwa towaru', fillColor: '#eeeeee'},
                { text: 'Cena netto', fillColor: '#eeeeee'},
                { text: 'Cena brutto', fillColor: '#eeeeee'},
                { text: 'Wartość netto', fillColor: '#eeeeee'},
                { text: 'Wartość brutto', fillColor: '#eeeeee'}
            ] ];

            this.invoice.positions.forEach(function(column) {
                i = i + 1;
                let netP = column.netPrice.split('.', 2);
                let netPrc = netP[0] + '.' + netP[1].substr(0, 2);
                let vatV = column.valueOfVat.split('.', 2);
                let vatVal = vatV[0] + '.' + vatV[1].substr(0, 2);
                body.push([ i, column.positionName, netPrc, column.grossPrice, column.vatTax, vatVal]);
            });


        console.log(body);

        return body;
  }
}
