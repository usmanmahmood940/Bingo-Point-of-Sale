import { Component, OnInit ,OnDestroy } from '@angular/core';

import { ApiService } from "../../../services/navigation/api.service";
declare var $: any;

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit, OnDestroy {
  products = [];
  filteredProducts: any[];
  categoryList;
  filterBy;

  isLoading = false;
  constructor(private apiService: ApiService) {
    // check if there is any data in the local storage
    const storedInvoiceProducts = localStorage.getItem("invoiceProducts");
    // localStorage.removeItem("invoiceProducts");
    // If there is any data in local storage then parse the data and populate the array
    if (storedInvoiceProducts) {
      this.invoiceProducts = JSON.parse(storedInvoiceProducts);
    }
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getCategories() {
    this.isLoading = true;
    this.apiService.getCategoryList().subscribe(
      (data) => {
        console.log("Category List Data:", data);
        if (data.status == 401) {
        }
        if (data != null && data != undefined) {
          try {
            this.categoryList = data.categoryList;

            this.categoryList.forEach(function (element) {
              element.isActive = false;
            });

            this.isLoading = false;
          } catch {}
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  getProducts() {
    this.isLoading = true;
    this.apiService.getProductList().subscribe(
      (data) => {
        console.log("Product List Data:", data);
        if (data.status == 401) {
        }
        if (data != null && data != undefined) {
          try {
            this.products = data.productList.filter((product) => {
              return product.availableQuantity > 0;
            });

            this.filteredProducts = [...this.products];
            this.isLoading = false;
          } catch {}
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  filter() {
    let filteredProducts = [...this.products];
    if (this.selectedCategory && !this.showAll) {
      filteredProducts = filteredProducts.filter(
        (product) => product._categoryId == this.selectedCategory._id
      );
    }
    this.filteredProducts = filteredProducts.filter(
      (product) =>
        product.price
          .toString()
          .toLowerCase()
          .includes(this.filterBy.toLowerCase()) ||
        product.name.toLowerCase().includes(this.filterBy.toLowerCase())
    );
  }

  invoiceProducts = [];

  addToInvoice(product) {
    const item = this.invoiceProducts.find(
      (x) => x.product._id === product._id
    );
    if (item) {
      return;
    }

    this.invoiceProducts.push({ product, quantity: 1, total: product.price });

    // store the invoice products array in local storage
    localStorage.setItem(
      "invoiceProducts",
      JSON.stringify(this.invoiceProducts)
    );

    console.log(this.invoiceProducts);
  }

  showAll = true;
  selectedCategory;
  oldSelctedCategory;

  setActiveCategory(categoryId) {
    this.categoryList.forEach((category) => {
      category.isActive = false;
    });

    //toggle between filter and all products
    this.showAll = !this.showAll;

    if (!this.showAll) {
      //add active class to selected category
      this.selectedCategory = this.categoryList.find(
        (category) => category._id == categoryId
      );
      this.selectedCategory.isActive = true;
      this.oldSelctedCategory = this.selectedCategory;

      this.filteredProducts = [
        ...this.products.filter((product) => product._categoryId == categoryId),
      ];
    } else {
      // if (this.selectedCategory.isActive) {
      //   if (this.oldSelctedCategory === this.selectedCategory) {
      //     this.selectedCategory.isActive = false;
      //     this.filteredProducts = [...this.products];
      //   }
      //   else {
      //     console.log("idhar aya hy");
      //     this.selectedCategory = this.categoryList.find(
      //       (category) => category._id == categoryId
      //     );
      //     this.selectedCategory.isActive = true;
      //     this.filteredProducts = [
      //       ...this.products.filter(
      //         (product) => product._categoryId == categoryId
      //       ),
      //     ];
      //     this.oldSelctedCategory = this.selectedCategory;
      //   }
      // }
      // else {
      //   this.selectedCategory = this.categoryList.find(
      //     (category) => category._id == categoryId
      //   );
      //   this.selectedCategory.isActive = true;
      //   this.filteredProducts = [
      //     ...this.products.filter(
      //       (product) => product._categoryId == categoryId
      //     ),
      //   ];
      // }
      // if (!this.selectedCategory.isActive) {
      //   this.selectedCategory = this.categoryList.find(
      //     (category) => category._id == categoryId
      //   );
      //   this.filteredProducts = [
      //     ...this.products.filter(
      //       (product) => product._categoryId == categoryId
      //     ),
      //   ];
      // }
      //   else
      this.filteredProducts = [...this.products];
    }
  }

  invoiceDetails;

  createInvoice(discount, totalAmount, givenAmount, changeAmount): void {
    let invoiceItem = this.invoiceProducts.map(
      ({ product, quantity, total }) => {
        return {
          _productId: product._id,
          quantity: quantity,
          totalProductAmount: total,
        };
      }
    );

    let sale = {
      productList: [...invoiceItem],
      discount: 0,
      totalAmount: totalAmount,
      givenAmount: givenAmount,
      changeAmount: changeAmount,
    };

    console.log("Sale:::::", sale);

    this.apiService.addSale(sale).subscribe(
      (data) => {
        console.log("Added Sale:", data);
        if (data != null && data != undefined) {
          try {
            this.invoiceDetails = {
              saleId: data.salesDetails.saleId,
              productList: [...this.invoiceProducts],
              discount: 0,
              totalAmount: totalAmount,
              givenAmount: givenAmount,
              changeAmount: changeAmount,
            };
            setTimeout(() => {
              
              this.invoiceProducts = [];
              this.printInvoice();
              
            }, 1000);
            localStorage.removeItem("invoiceProducts");
          } catch {}
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  totalAmount = 0;

  payInvoice(): void {
    if (this.invoiceProducts.length > 0) {
      this.totalAmount = 0;
      this.invoiceProducts.forEach((element) => {
        this.totalAmount += element.quantity * element.product.price;
      });

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
        <input type="text" placeholder="Total Amount" name="total" id="total" class="name form-control" value='${this.totalAmount}' readonly required />
      </div>
      <div class="col-md-6">
        <label for="given" class="form-label">Given Amount</label>
        <input type="number" id="given" name="given" class="form-control">
      </div>
      <div class="col-md-6">
        <label for="change" class="form-label">Change Amount</label>
        <input type="number" id="change" name="change" class="form-control" readonly>
      </div>    

        <div class="col-12">
        <label for="disabledTextInput" class="form-label"></label>
        
      </div>
    </div>
       `,
        onContentReady: function () {
          $("#given").focus();
          $("#given").keyup(function () {
            var given = $("#given").val();
            var total = $("#total").val();

            var change = $("#change").val(given - total);
          });
        },
        type: "Green",
        typeAnimated: true,
        buttons: {
          yes: {
            text: "Create Invoice",
            btnClass: "btn-green",
            action: () => {
              // console.log("Give value " + JSON.stringify($("#given").val()));
              if ($("#change").val() >= 0 && !($("#given").val() === "")) {
                this.createInvoice(
                  0,
                  $("#total").val(),
                  $("#given").val(),
                  $("#change").val()
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
    } else {
      this.errorDialog("Warning", "List is Empty");
    }
  }

  errorDialog(title,msg) {
    $.confirm({
      title:title,
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

  printInvoice(): void {
    window.print();
  }

  ngOnDestroy() {
    localStorage.removeItem("invoiceProducts");
  }
}
