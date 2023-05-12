import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { Route, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  sales = [];
  isLoadingCheck = false;
  filteredSales: any[];
  filterBy;
  startDate;
  endDate;
  constructor(protected apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getSales();
    this.getProductList();
  }
  isLoading() {
    if (this.isLoadingCheck) return false;
    else return true;
  }

  getFilterdSales(start, end) {
    if (end > start) {
      
        this.isLoadingCheck = false;
        this.apiService.getSalesByFilter(start, end).subscribe(
          (data) => {
            console.log("Sales List Data:", data);
            if (data.status == 401) {
              // sessionStorage.setItem('isAuthenticated', '');
              // this.router.navigate(['/connection']);
              // this.isLoadingCheck;
            }
            if (data != null && data != undefined) {
              try {
                // this.MaxPage = data.totalPages;
                // console.log(data.content)
                // console.log(data.result.tenants)
                this.sales = data.salesList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
                this.filteredSales = [...this.sales];
                // if (this.pageNum < this.MaxPage-1)
                //   this.isNext = false;
                // else
                //   this.isNext = true;
                // console.log("New sales " + this.sales.at(0).totalAmount);

                this.isLoadingCheck = true;
              } catch {}
            } else {
              this.isLoadingCheck = true;
            }
          },
          (error) => {
            console.log(error);
            this.isLoadingCheck = true;
          }
        );
      
    } else {
      if (start === undefined || end === undefined) {
        this.errorDialog(
          "Date Validation",
          "Choose Valid Date"
        );
      } else {

        this.errorDialog(
          "Date Validation",
          "End Date is smaller than start Date"
        );
      }
    }
  }

  sortField = "name";
  sortDirection = "asc";

  addSale() {
    this.router.navigate(["/sales/add"]);
  }
  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  filterSelect = "all";
  selectedOption(event: any) {
    this.filterSelect = event.target.value;
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getSales();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSales();
  }

  filter() {
    if (this.filterSelect === "all") {
      this.filteredSales = [
        ...this.sales.filter(
          (sale) =>
            this.apiService
              .getDateFormat(sale.createdAt)
              .toLowerCase()
              .includes(this.filterBy.toLowerCase()) ||
            this.apiService
              .getTime(sale.createdAt)
              .toLowerCase()
              .includes(this.filterBy.toLowerCase()) ||
            sale.totalAmount
              .toString()
              .toLowerCase()
              .includes(this.filterBy.toLowerCase()) ||
            sale.discount
              .toString()
              .toLowerCase()
              .includes(this.filterBy.toLowerCase())
        ),
      ];
    } else {
      this.filteredSales = [
        ...this.sales.filter((sale) =>
          sale.saleId
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
        ),
      ];
    }
  }

  getSales() {
    this.apiService.getSalesList().subscribe(
      (data) => {
        console.log("Sales List Data:", data);
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
          // this.isLoadingCheck;
        }
        if (data != null && data != undefined) {
          try {
            // this.MaxPage = data.totalPages;
            // console.log(data.content)
            // console.log(data.result.tenants)
            this.sales = data.salesList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
            this.filteredSales = [...this.sales];
            // if (this.pageNum < this.MaxPage-1)
            //   this.isNext = false;
            // else
            //   this.isNext = true;
            // console.log("New sales " + this.sales.at(0).totalAmount);

            this.isLoadingCheck = true;
          } catch {}
        } else {
          this.isLoadingCheck = true;
        }
      },
      (error) => {
        console.log(error);
        this.isLoadingCheck = true;
      }
    );
  }

  invoiceDetails;
  products = new Map();
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

  viewSale(id: any) {
    this.isLoading;
    this.apiService.getSalesById(id).subscribe(
      (data) => {
        console.log("Picked Sale:", data);
        if (data.status == 401) {
        }
        if (data != null && data != undefined) {
          try {
            console.log(data);

            let productList = [];

            productList = data.sales.productsList.map(
              ({ _productId, quantity,totalProductAmount }) => {
                let product = this.products.get(_productId);
                return {
                  product: product,
                  quantity: quantity,
                  price: product.price,
                  total: totalProductAmount,
                };
              }
            );

            this.invoiceDetails = {
              saleId:data.sales.saleId,
              productList: [...productList],
              discount: 0,
              totalAmount: data.sales.totalAmount,
              givenAmount: data.sales.givenAmount,
              changeAmount: data.sales.changeAmount,
            };

            setTimeout(() => {
              window.print();
            }, 1000);
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
  }

  deleteSale(id: any) {
    this.isLoadingCheck = false;
    this.apiService.deleteSale(id).subscribe(
      (data) => {
        console.log("Sale Deleted:", data);
        if (data.status == 200) {
          this.getSales();
        }
        if (data != null && data != undefined) {
          try {
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async exportProductList(id: any) {
    let pickedSale: any;
    if (this.sales.length != 0) {
      try {
        let data1: any = await this.getSaleById(id);
        pickedSale = data1.sales;
        console.log("Picked Sale Data:", pickedSale);
        let productList: any;
        productList = pickedSale.productsList;
        let sortArr = [];
        for (let i = 0; i < productList.length; i++) {
          let product: any;
          let data2: any = await this.getProductById(productList[i]._productId);
          product = data2.product;
          console.log("Product : " + JSON.stringify(data2));
          var newObject = {
            "Product Id": productList[i]._productId,
            "Product Name": product.name,
            "Product Unit": product.unit,
            "Product Price": product.price,
            "Product quantity": productList[i].quantity,
            "Product Total Amount": productList[i].totalProductAmount,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "SaleProductList_" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  getSaleById(saleId: any): Promise<any> {
    return this.apiService.getSalesById(saleId).toPromise();
  }
  getProductById(id: any): Promise<any> {
    return this.apiService.getProductByID(id).toPromise();
  }

  loadexportdata() {
    if (this.sales.length != 0) {
      try {
        let sortArr = [];
        for (let i = 0; i < this.sales.length; i++) {
          var newObject = {
            "Sale Id": this.sales[i]._id,
            "Sale Date": this.apiService.getDateFormat(this.sales[i].createdAt),
            "Sale Time": this.apiService.getTime(this.sales[i].createdAt),
            "Sale discount": this.sales[i].discount,
            "Sale Total Amount": this.sales[i].totalAmount,
            "Sale Given Amount": this.sales[i].givenAmount,
            "Sale Change Amount": this.sales[i].changeAmount,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "SalesList_" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  confirmDialog(id: any) {
    $.confirm({
      title: "Delete",
      content: "Do you want to delete this record",
      type: "Green",
      typeAnimated: true,
      buttons: {
        yes: {
          text: "confirm",
          btnClass: "btn-green",
          action: () => this.deleteSale(id),
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
