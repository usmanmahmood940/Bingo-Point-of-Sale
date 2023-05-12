import { Component, OnInit } from '@angular/core';
import {
  Input,
  Output,
  EventEmitter,
} from '@angular/core';



@Component({
  selector: 'app-create-invoice-table',
  templateUrl: './create-invoice-table.component.html',
  styleUrls: ['./create-invoice-table.component.scss'],

})
export class CreateInvoiceTableComponent implements OnInit {

  @Input() invoiceProducts = []


  constructor() { }

  ngOnInit(): void {
  
  }

  increaseQuantity(item) {
    item.quantity++;
    item.total = item.quantity * item.product.price;
    localStorage.setItem('invoiceProducts', JSON.stringify(this.invoiceProducts));
  }

  decreaseQuantity(item) {
    if (item.quantity <= 1) {
      return
    }
    item.quantity--;
    item.total = item.quantity * item.product.price;
    localStorage.setItem('invoiceProducts', JSON.stringify(this.invoiceProducts));
  }

  removeFromInvoice(item) {
    const index = this.invoiceProducts.indexOf(item);
    if (index > -1) { // only splice array when item is found
      this.invoiceProducts.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('invoiceProducts', JSON.stringify(this.invoiceProducts));
  }

  allTotal(): number {
    let total = 0;

    this.invoiceProducts.forEach(item => {
      total += item.product.price * item.quantity;
    });

    return total;
  }


}
