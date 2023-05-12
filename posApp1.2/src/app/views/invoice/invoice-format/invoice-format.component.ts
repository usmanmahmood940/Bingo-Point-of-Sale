import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-format',
  templateUrl: './invoice-format.component.html',
  styleUrls: ['./invoice-format.component.scss'],
})
export class InvoiceFormatComponent implements OnInit {
  @Input() invoiceDetails: any;
  constructor() {}
  barcode = '';
  qrCodeLink = '';
  id = 123555
  ngOnInit(): void {
    console.log(this.invoiceDetails);
    this.qrCodeLink = 'http://localhost:4200/invoice';
    this.barcode = this.id.toString().padStart(10, '0');
  }


}
