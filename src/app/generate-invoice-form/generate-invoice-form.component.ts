import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {InvoiceForm, InvoiceResponse} from '../app.component';
import {AuthService} from '../auth.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {forEach} from '@angular/router/src/utils/collection';

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
    let invoice: string;
    if (this.router.url.includes('ProForma')) {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addProFormaInvoice';
      invoice = 'ProForma';
    } else {
      url = 'http://localhost:8080/warsztatZlomek/rest/invoice/addInvoice';
      invoice = 'VAT';
    }
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
        console.log(this.invoice);
        if (invoice === 'VAT') {
            this.makePDF();
        } else {
            this.makeProForma();
        }

      }, result => {
        if (result.accessToken !== null) {
          this.authService.setExpirationDate();
        }
      });
  }

  makePDF() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const finishPrice = Number(this.invoice.grossValue) - Number(this.invoice.discount);
      let paymentMethod: string;
      switch (this.invoice.methodOfPayment) {
          case 'TRANSFER': { paymentMethod = 'Przelew bankowy'; break; }
          case 'CASH': { paymentMethod = 'Gotówka'; break; }
          case 'CARD': { paymentMethod = 'Karta płatnicza'; break; }
      }
      this.pdf = {
          content: [
              { text: 'Faktura VAT nr ' + this.invoice.invoiceNumber, style: 'header' },
              { text: 'Oryginał', style: 'bold' },
              { text: 'Data wystawienia: ' + this.changeDateFormat(this.invoice.dayOfIssue), style: ['anotherStyle']},
              { text: 'Data sprzedaży: ' + this.changeDateFormat(this.invoice.serviceFinishDate), style: ['anotherStyle']},
              { text: 'Termin zapłaty: ' + this.changeDateFormat(this.invoice.paymentDate), style: ['anotherStyle']},
              { text: ''},
              {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3}], margin: [0, 20, 0, 0]},
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
                      widths: ['4%', '45%', '7%', '5%', '10%', '9%', '10%', '10%'],
                      body: this.buildTableBody()
                  },
                  margin: [0, 20, 0, 0]
              },
              {
                  table: {
                      body: [[{text: 'Wartość:'}, {text: this.invoice.grossValue}],
                            [{text: 'Zniżka'}, {text: this.invoice.discount}],
                            [{text: 'Do zapłaty'}, {text: finishPrice}]]
                  },
                  margin: [350, 20, 0, 0]
              },
              { text: 'Kwota należności: ' + finishPrice, style: {fontSize: 20, bold: true}, margin: [0, 20, 0, 0]},
              { text: 'Sposób zapłaty: ' + paymentMethod},
              { text: 'Termin zapłaty: ' + this.changeDateFormat(this.invoice.paymentDate)},
              { columns: [
                      [
                          { text: 'Podpis sprzedawcy'},
                      ],
                      [],
                      [],
                      [
                          { text: 'Podpis nabywcy'},
                      ]
                  ],  margin: [ 0, 80, 0, 0 ]
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
        const body = [];
        body.push([ { text: 'Nr', fillColor: '#eeeeee'},
            { text: 'Nazwa towaru', fillColor: '#eeeeee'},
            { text: 'Ilość', fillColor: '#eeeeee' },
            { text: 'JM', fillColor: '#eeeeee' },
            { text: 'Wartość netto', fillColor: '#eeeeee'},
            { text: 'VAT[%]', fillColor: '#eeeeee'},
            { text: 'Wartość VAT', fillColor: '#eeeeee'},
            { text: 'Wartość brutto', fillColor: '#eeeeee'}
        ]);

        this.invoice.positions.forEach(function(column) {
                i = i + 1;
                const netP = column.netPrice.split('.', 2);
                const netPrc = netP[0] + '.' + netP[1].substr(0, 2);
                const vatV = column.valueOfVat.split('.', 2);
                const vatVal = vatV[0] + '.' + vatV[1].substr(0, 2);
                body.push([{text: i + ' ', fillColor: '#FFFFFF'},
                    {text: column.positionName, fillColor: '#FFFFFF'},
                    {text: column.count, fillColor: '#FFFFFF'},
                    {text: column.unitOfMeasure, fillColor: '#FFFFFF'},
                    {text: netPrc, fillColor: '#FFFFFF'},
                    {text: column.vatTax, fillColor: '#FFFFFF'},
                    {text: vatVal, fillColor: '#FFFFFF'},
                    {text: column.grossPrice, fillColor: '#FFFFFF'}]);

        });

        return body;
  }

  changeDateFormat(date) {
      let splitted = date.split('-', 3);
      if (splitted[0].length === 1) {
          splitted[0] = '0' + splitted[0];
      }
      if (splitted[1].length === 1) {
          splitted[1] = '0' + splitted[1];
      }
      return splitted[0] + '-' + splitted[1] + '-' + splitted[2];
  }

  makeProForma() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const finishPrice = Number(this.invoice.grossValue) - Number(this.invoice.discount);
      let paymentMethod: string;
      switch (this.invoice.methodOfPayment) {
          case 'TRANSFER': { paymentMethod = 'Przelew bankowy'; break; }
          case 'CASH': { paymentMethod = 'Gotówka'; break; }
          case 'CARD': { paymentMethod = 'Karta płatnicza'; break; }
      }
      this.pdf = {
          content: [
              { text: 'Faktura pro-forma nr ' + this.invoice.invoiceNumber, style: 'header' },
              { text: 'Data wystawienia: ' + this.changeDateFormat(this.invoice.dayOfIssue)},
              { text: ''},
              {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3}], margin: [0, 20, 0, 0]},
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
                      widths: ['4%', '45%', '7%', '5%', '10%', '9%', '10%', '10%'],
                      body: this.buildTableBody()
                  },
                  margin: [0, 20, 0, 0]
              },
              {
                  table: {
                      body: [[{text: 'Wartość:'}, {text: this.invoice.grossValue}],
                          [{text: 'Zniżka'}, {text: this.invoice.discount}],
                          [{text: 'Do zapłaty'}, {text: finishPrice}]]
                  },
                  margin: [350, 20, 0, 0]
              },
              { text: 'Kwota należności: ' + finishPrice, style: {fontSize: 20, bold: true}, margin: [0, 20, 0, 0]},
              { text: 'Sposób zapłaty: ' + paymentMethod},
              { text: 'Termin zapłaty: ' + this.changeDateFormat(this.invoice.paymentDate)},
              { columns: [
                      [
                          { text: 'Podpis sprzedawcy'},
                      ],
                      [],
                      [],
                      [
                          { text: 'Podpis nabywcy'},
                      ]
                  ],  margin: [ 0, 40, 0, 0 ]
              },
          ],
          styles: {
              header: {
                  fontSize: 22,
                  bold: true
              }
          }
      };
      pdfMake.createPdf(this.pdf).download();
  }
}
