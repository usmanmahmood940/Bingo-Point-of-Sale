import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  products = [];
  filteredProducts: any[];
  filterBy;
  filterSelect = "all";

  isLoadingCheck = false;
  category = new Map();

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.getProducts();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getProducts();
  }

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }
  filter() {
    if (this.filterSelect === "all") {
      this.filteredProducts = [
        ...this.products.filter(
          (product) =>
            this.category
              .get(product._categoryId)
              .toLowerCase()
              .includes(this.filterBy.toLowerCase()) ||
            product.price
              .toString()
              .toLowerCase()
              .includes(this.filterBy.toLowerCase()) ||
            product.createdAt.includes(this.filterBy.toLowerCase()) ||
            product.name.toLowerCase().includes(this.filterBy.toLowerCase()) ||
            product.unit.toLowerCase().includes(this.filterBy.toLowerCase())
        ),
      ];
    } else {
      this.filteredProducts = [
        ...this.products.filter((product) =>
          product.code
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
        ),
      ];
    }
  }

  constructor(protected apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCategoryList();
  }

  isLoading() {
    if (
      (this.category.size > 0 && this.products.length > 0) ||
      this.isLoadingCheck
    )
      return false;
    else return true;
  }

  addProduct() {
    console.log("Category size is " + this.category.size);
    if (this.category.size != 0) this.router.navigate(["/products/add"]);
    else {
      this.errorDialog("Add Category First");
    }
  }

  errorDialog(message: any) {
    $.confirm({
      title: "No Category",
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

  getProducts() {
    this.apiService.getProductList().subscribe(
      (data) => {
        console.log("Product List Data:", data);
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
        }
        if (data != null && data != undefined) {
          try {
            this.products = data.productList;
            this.filteredProducts = [...this.products];
            // this.totalRecords = data.totalProducts
            this.isLoadingCheck = true;
          } catch {}
        } else {
        }
      },
      (error) => {
        this.isLoadingCheck = true;
        console.log(error);
      }
    );
  }

  deleteProduct(id: any) {
    this.isLoadingCheck = false;
    this.apiService.deleteProduct(id).subscribe(
      (data) => {
        console.log("Product Deleted:", data);
        if (data.status == 200) {
          this.getProducts();
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

  viewProduct(productId: any, categoryName: any, apiService: ApiService) {
    // let CategoryName = this.category.get();
    $.confirm({
      theme: "light",
      title: "<strong class='title-bold'>Product</strong>",
      content: function () {
        var self = this;
        var user = JSON.parse(localStorage.getItem("user"));
        var dbName = user.dbName;
        return $.ajax({
          url:
            UrlMappings.GetProductById +
            "?dbName=" +
            dbName +
            "&" +
            "productId=" +
            productId,
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
        <label for="disabledTextInput" class="form-label">Category</label>
        <input type="text" id="name" class="form-control" value='${categoryName}' readonly>
      </div>

          <div class="col-12">
        <label for="disabledTextInput" class="form-label">Code</label>
        <input type="number" id="name" class="form-control" value='${
          response.product.code
        }' readonly>
      </div>
      
      <div class="col-12">
        <label for="disabledTextInput" class="form-label">Name</label>
        <input type="text" id="name" class="form-control" value='${
          response.product.name
        }' readonly>
      </div>
            
      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Price</label>
        <input type="text" id="name" class="form-control" value='${
          response.product.price
        }' readonly>
      </div>
            
       <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Unit</label>
        <input type="text" id="name" class="form-control" value='${
          response.product.unit
        }' readonly>
      </div>

      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Created Date</label>
        <input type="text" id="name" class="form-control" value='${apiService.getDateFormat(
          response.product.createdAt
        )}' readonly>
      </div>

      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Created By</label>
        <input type="text" id="name" class="form-control" value='${
          response.product.createdBy
        }' readonly>
      </div>

      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Updated Date</label>
        <input type="text" id="name" class="form-control" value='${apiService.getDateFormat(
          response.product.updatedAt
        )}' readonly>
      </div>

      <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Updated By</label>
        <input type="text" id="name" class="form-control" value='${
          response.product.updatedBy
        }' readonly>
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
        Cancel: {
          btnClass: "cancel",
          action: function () {
            // this.professionId = "";
          },
        },
      },
    });
  }

  getCategoryList() {
    this.apiService.getCategoryList().subscribe(
      (data) => {
        console.log("Category", data);
        if (data != null && data != undefined) {
          try {
            data.categoryList.forEach((element: any) => {
              this.category.set(element._id, element.name);
            });
            console.log(this.category);
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategoryName(id: any) {
    return this.category.get(id);
  }

  loadexportdata() {
    if (this.products.length != 0) {
      try {
        let sortArr = [];
        for (let i = 0; i < this.products.length; i++) {
          var newObject = {
            "Product Name": this.products[i].name,
            Category: this.category.get(this.products[i]._categoryId),
            "Product Price": this.products[i].price,
            "Product Unit": this.products[i].unit,
            "Category Date": this.products[i].createdAt,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "Product_Reports" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  categoryInUse(id: any) {
    this.apiService.getSaleByProduct(id).subscribe(
      (data) => {
        console.log("Products by Sales List Data:", data);
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
        }
        if (data != null && data != undefined) {
          try {
            if (data.count > 0) {
              $.confirm({
                title: "Failure",
                content: "Product is In Use in Sales",
                type: "Green",
                typeAnimated: true,
                buttons: {
                  Close: {
                    text: "Close",
                    btnClass: "btn-green",
                  },
                },
              });

              // this.toastr.error("Category In Use");
            } else {
              this.apiService.getReceivingByProduct(id).subscribe(
                (data) => {
                  console.log("Products by Receiving List Data:", data);
                  if (data.status == 401) {
                    // sessionStorage.setItem('isAuthenticated', '');
                    // this.router.navigate(['/connection']);
                    // this.isLoading;
                  }
                  if (data != null && data != undefined) {
                    try {
                      if (data.count > 0) {
                        $.confirm({
                          title: "Failure",
                          content: "Product is In Use in Receiving",
                          type: "Green",
                          typeAnimated: true,
                          buttons: {
                            Close: {
                              text: "Close",
                              btnClass: "btn-green",
                            },
                          },
                        });

                        // this.toastr.error("Category In Use");
                      } else {
                        $.confirm({
                          title: "Delete",
                          content: "Do you want to delete this record",
                          type: "Green",
                          typeAnimated: true,
                          buttons: {
                            yes: {
                              text: "confirm",
                              btnClass: "btn-green",

                              action: () => this.deleteProduct(id),
                            },
                            close: {
                              text: "close",
                              btnClass: "btn btn-outline-secondary",
                              action: function () {},
                            },
                          },
                        });
                      }
                      // this.MaxPage = data.totalPages;
                      // console.log(data.content)
                      // console.log(data.result.tenants)
                      //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);

                      // if (this.pageNum < this.MaxPage-1)
                      //   this.isNext = false;
                      // else
                      //   this.isNext = true;
                    } catch {}
                  } else {
                  }
                },
                (error) => {
                  console.log(error);
                }
              );
            }
            // this.MaxPage = data.totalPages;
            // console.log(data.content)
            // console.log(data.result.tenants)
            //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);

            // if (this.pageNum < this.MaxPage-1)
            //   this.isNext = false;
            // else
            //   this.isNext = true;
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectedOption(event: any) {
    this.filterSelect = event.target.value;
  }
}
