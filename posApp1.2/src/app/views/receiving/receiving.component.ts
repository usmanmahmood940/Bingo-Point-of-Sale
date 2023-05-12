import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-receiving",
  templateUrl: "./receiving.component.html",
  styleUrls: ["./receiving.component.scss"],
})
export class ReceivingComponent implements OnInit {
  receivings = [];

  filteredReceiving: any[];
  filterBy;
  isLoadingCheck;
  startDate;
  endDate;

  products = new Map();
  constructor(protected apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.getProductList();
    this.getReceivings();
  }
  getReceivingByFilter(start, end) {
    if (end > start) {
      this.isLoadingCheck = false;
      this.apiService.getReceivingByFilter(start, end).subscribe(
        (data) => {
          console.log("Receiving List Data:", data);
          if (data.status == 401) {
            // sessionStorage.setItem('isAuthenticated', '');
            // this.router.navigate(['/connection']);
            // this.isLoading;
          }
          if (data != null && data != undefined) {
            try {
              // this.MaxPage = data.totalPages;
              // console.log(data.content)
              // console.log(data.result.tenants)

              this.receivings = data.receivingList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
              this.filteredReceiving = [...this.receivings];
              this.isLoadingCheck = true;
              // if (this.pageNum < this.MaxPage-1)
              //   this.isNext = false;
              // else
              //   this.isNext = true;
              // console.log("New sales " + this.receivings.at(0).totalAmount);
            } catch {}
          } else {
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      if (start === undefined || end === undefined) {
        this.apiService.errorDialog("Date Validation", "Choose Valid Date");
      } else {
        this.apiService.errorDialog(
          "Date Validation",
          "End Date is smaller than start Date"
        );
      }
    }
  }

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }
  isLoading() {
    if (
      (this.products.size > 0 && this.receivings.length > 0) ||
      this.isLoadingCheck
    )
      return false;
    else return true;
  }
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.getReceivings();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getReceivings();
  }

  filter() {
    this.filteredReceiving = [
      ...this.receivings.filter(
        (receiving) =>
          this.apiService
            .getDateFormat(receiving.createdAt)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.apiService
            .getTime(receiving.createdAt)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.products
            .get(receiving._productId)
            .name.toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          receiving.stockBuy
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          receiving.totalAmount
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          receiving.discount
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
      ),
    ];
  }

  getReceivings() {
    this.apiService.getReceivingList().subscribe(
      (data) => {
        console.log("Receiving List Data:", data);
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
          // this.isLoading;
        }
        if (data != null && data != undefined) {
          try {
            // this.MaxPage = data.totalPages;
            // console.log(data.content)
            // console.log(data.result.tenants)
            this.isLoadingCheck = true;
            this.receivings = data.receivingList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
            this.filteredReceiving = [...this.receivings];
            // if (this.pageNum < this.MaxPage-1)
            //   this.isNext = false;
            // else
            //   this.isNext = true;
            // console.log("New sales " + this.receivings.at(0).totalAmount);
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addReceiving() {
    if (this.products.size != 0) this.router.navigate(["/receiving/add"]);
    else {
      this.errorDialog("Add Products First");
    }
  }

  viewReceiving(receivingId: any, product: any, apiService: ApiService) {
    // let CategoryName = this.category.get();
    $.confirm({
      theme: "light",
      title: "<strong class='title-bold'>Receiving</strong>",
      content: function () {
        var self = this;
        var user = JSON.parse(localStorage.getItem("user"));
        var dbName = user.dbName;
        return $.ajax({
          url:
            UrlMappings.GetReceivingById +
            "?dbName=" +
            dbName +
            "&" +
            "receivingId=" +
            receivingId,
          dataType: "json",
          method: "get",
        })
          .done(function (response) {
            console.log("Responce from api:::::", self);

            self.setContent(`
             <style>
              label{
                  font-weight: bold;
              }
            </style>
            <div class="row g-3">

            <div class="col-12">
        <label for="disabledTextInput" class="form-label">Product Name</label>
        <input type="text" id="name" class="form-control"  value='${product}' readonly>
      </div>

      <div class="col-12">
        <label for="disabledTextInput" class="form-label">Stock Buy</label>
        <input type="text" id="name" class="form-control"  value='${
          response.receiving.stockBuy
        }' readonly>
      </div>
            
       <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Total Amount</label>
        <input type="text" id="name" class="form-control" value='${
          response.receiving.totalAmount
        }'  readonly>
      </div>

      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Discount</label>
        <input type="text" id="name" class="form-control" value='${
          response.receiving.discount
        }'  readonly>
      </div>

      <div class="col-12">
        <label for="disabledTextInput" class="form-label">Date</label>
        <input type="text" id="name" class="form-control" value='${apiService.getDateFormat(
          response.receiving.createdAt
        )}' readonly>
      </div>
           
            
            <div class="col-12">
        <label for="disabledTextInput" class="form-label"></label>
            </div>
            
            </div>
             `);
          })
          .fail(function () {
            // self.setContent('Something went wrong.');
          });
      },
      onContentReady: function () {
        //     $('#search').keyup(function () {
        //         $('#result').html('');
        //         var searchField = $('#search').val();
        //         // console.log(searchField)
        //         // console.log(data);
        //         var expression = new RegExp(searchField, 'i');
        //         $.each(data, function (key, value) {
        //             if (searchField == "") {
        //                 $("#result").html('');
        //                 return;
        //             }
        //             if (value.name.search(expression) != -1) {
        //                 count++
        //                 if (count < 10) {
        //                     $('#result').append('<li class="list-group-item link-class" style="color:#495057"> ' + value.name + '<span class="text-muted" style="display:none">|' + value.id + '</span></li>');
        //                 }
        //             }
        //         });
        //         //console.log(count)
        //         count = 0;
        //     });
        //     $('#result').on('click', 'li', function () {
        //         var click_text = $(this).text().split('|');
        //         $('#search').val($.trim(click_text[0]));
        //         $("#result").html('');
        //         console.log($.trim(click_text[0]))
        //         console.log($.trim(click_text[1]))
        //         this.professionEn = $.trim(click_text[0]);
        //         this.professionId = $.trim(click_text[1]);
        //     });
      },
      typeAnimated: true,
      draggable: false,
      useBootstrap: true,
      boxWidth: "600px",
      animationBounce: 1.5,
      buttons: {
        Close: {
          btnClass: "Close",
          action: function () {},
        },
      },
    });
  }

  deleteReceiving(id: any) {
    this.apiService.deleteReceiving(id).subscribe(
      (data) => {
        console.log("Sale Deleted:", data);
        if (data.status == 200) {
          this.getReceivings();
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

  async loadexportdata() {
    if (this.receivings.length != 0) {
      try {
        let sortArr = [];
        let product: any;
        let data: any;
        for (let i = 0; i < this.receivings.length; i++) {
          data = await this.getProductById(this.receivings[i]._productId);
          product = data.product;
          var newObject = {
            "Receiving Id": this.receivings[i]._id,
            "Receiving Date": this.apiService.getDateFormat(
              this.receivings[i].createdAt
            ),
            "Receiving Time": this.apiService.getTime(
              this.receivings[i].createdAt
            ),
            "Product Id": product._id,
            "Product Name": product.name,
            "Product Unit": product.unit,
            "Stock Buy": this.receivings[i].stockBuy,
            Discount: this.receivings[i].discount,
            "Total Amount": this.receivings[i].totalAmount,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "RecceivingList" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  getProductById(id: any): Promise<any> {
    return this.apiService.getProductByID(id).toPromise();
  }

  getProductName(id: any) {
    let product: any;
    product = this.products.get(id);
    if (product == undefined) return "NaN";
    else return product.name;
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

  errorDialog(message: any) {
    $.confirm({
      title: "No Products",
      content: message,
      type: "Green",
      typeAnimated: true,
      buttons: {
        close: {
          text: "ok",
          btnClass: "btn-warning",
          action: function () {},
        },
      },
    });
  }
  confirmDialog(id: any) {
    $.confirm({
      title: "Delete",
      content: "Do you want to delete this record",
      type: "Green",
      typeAnimated: true,
      buttons: {
        yes: {
          text: "Confirm",
          btnClass: "btn-green",
          action: () => this.deleteReceiving(id),
        },
        close: {
          text: "close",
          action: function () {},
        },
      },
    });
  }
}
