import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/navigation/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisTypeNode } from 'typescript/lib/tsserverlibrary';
declare var $: any;
@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  invoiceProducts = [];
  filteredInvoiceProducts = [];
  products = new Map();
  sales: any;
  saleId: any;
  filterBy

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getSaleByid();
    this.getProductList();
  }

  filter() {
    
    this.filteredInvoiceProducts = [
      ...this.invoiceProducts.filter(
        (product) =>
          this.getProductPrice(product._productId)
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.getProductName(product._productId)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.getProductUnit(product._productId)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.getProductCode(product._productId)
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          product.quantity
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          product.totalProductAmount
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
      ),
    ];
  }

  getSaleByid() {
    this.route.params.subscribe((params) => {
      this.saleId = params["id"];
      console.log(params["id"]);

      this.apiService.getSalesById(params["id"]).subscribe(
        (data) => {
          console.log("Product List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              console.log(data);

              this.sales = data.sales;
              this.invoiceProducts = data.sales.productsList;
              this.filteredInvoiceProducts = [...this.invoiceProducts];
              console.log(this.invoiceProducts);
            } catch {}
          } else {
            // this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);
          // this.isLoading = false;
        }
      );
    });
  }

  getProductList() {
    this.apiService.getProductList().subscribe(
      (data) => {
        console.log("Product", data);
        if (data != null && data != undefined) {
          try {
            data.productList.forEach((element: any) => {
              this.products.set(element._id, element);
            });
            console.log(this.products);
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductCode(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.code;
  }
  getProductName(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.name;
  }
  getProductUnit(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.unit;
  }

  getProductPrice(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.price;
  }

  getProductAvailable(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.availableQuantity;
  }

  increaseQuantity(item) {
    item.quantity++;
    item.total = item.quantity * this.getProductPrice(item._productId);
  }

  decreaseQuantity(item) {
    if (item.quantity <= 0) {
      return;
    }
    item.quantity--;
    item.total = item.quantity * this.getProductPrice(item._productId);
  }

  removeFromInvoice(item) {
    const index = this.invoiceProducts.indexOf(item);
    if (index > -1) {
      // only splice array when item is found
      this.invoiceProducts.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  allTotal(): number {
    let total = 0;

    this.invoiceProducts.forEach((item) => {
      total += this.getProductPrice(item._productId) * item.quantity;
    });

    return total;
  }

  updateInvoice(discount, totalAmount, givenAmount, changeAmount) {
    let sale = {
      saleId: this.saleId,
      productList: [...this.invoiceProducts],
      discount: 0,
      totalAmount: totalAmount,
      givenAmount: givenAmount,
      changeAmount: changeAmount,
    };

    console.log("Sale:::::", sale);

    this.apiService.updateSales(sale).subscribe(
      (data) => {
        console.log("Sales List Data:", data);
        if (data != null && data != undefined) {
          try {
            console.log("Updated");
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  payInvoice(): void {
    $.confirm({
      title: "Pay",
      content: `
      <style>
        label{
            font-weight: bold;
        }
        input[type='number'] {
          -moz-appearance:textfield;
      }
      
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
          -webkit-appearance: none;
      }
      </style>
      <div class="row g-3">
      <div class="col-12">
        <label for="disabledTextInput" class="form-label">Total Amount</label>
        <input type="text" placeholder="Total Amount" name="total" id="total" class="name form-control" value='${this.allTotal()}' readonly required />
      </div>
      <div class="col-md-6">
        <label for="given" class="form-label">Given Amount</label>
        <input type="number" id="given" name="given" class="form-control" value='${
          this.sales.givenAmount
        }'>
      </div>
      <div class="col-md-6">
        <label for="change" class="form-label">Change Amount</label>
        <input type="number" id="change" name="change" class="form-control" value='${
          this.sales.changeAmount
        }'readonly>
      </div>   
      <div class="col-md-12">
        <label for="change" class="form-label">New Change Amount</label>
        <input type="number" id="newchange" name="change" class="form-control" readonly>
      </div>  
       <div class="col-md-12">
        <label for="change" class="form-label"></label>
      </div>  
    </div>
       `,
      onContentReady: function () {
        $("#given").focus();
        $("#newchange").val(
          $("#given").val() - $("#total").val() - $("#change").val()
        );
      },
      type: "Green",
      typeAnimated: true,
      buttons: {
        yes: {
          text: "Update Invoice",
          btnClass: "btn-green",
          action: () => {
            if ($("#newchange").val() >= 0 && !($("#given").val() === "")) {
              this.updateInvoice(
                0,
                $("#total").val(),
                $("#given").val(),
                $("#newchange").val()
              );
            } else {
              this.errorDialog(
                "Validation",
                "Given Amount is less than the Total Amount"
              );
            }
          },
        },
        close: {
          text: "close",
          action: function () {},
        },
      },
    });
  }

  errorDialog(title, msg) {
    $.confirm({
      title: title,
      content: msg,
      type: "red",
      typeAnimated: true,
      buttons: {
        tryAgain: {
          text: "close",
          btnClass: "btn-red",
          action: function () {},
        },
      },
    });
  }
}
