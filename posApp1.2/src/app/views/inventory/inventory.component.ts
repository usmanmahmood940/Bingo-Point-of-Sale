import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";

declare var $: any;

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent implements OnInit {
  products: any;
  isLoadingCheck = false;
  filteredProducts: any[];
  filterBy;
  filterSelect ="all"

  constructor(protected apiService: ApiService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  selectedOption(event: any) {
    this.filterSelect = event.target.value;
  }
  isLoading() {
    if (this.isLoadingCheck) return false;
    else return true;
  }

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getProducts();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getProducts();
  }

  filter() {
     if (this.filterSelect === "all") {
       this.filteredProducts = [
         ...this.products.filter(
           (product) =>
             product.name.toLowerCase().includes(this.filterBy.toLowerCase()) ||
             product.availableQuantity
               .toString()
               .toLowerCase()
               .includes(this.filterBy.toLowerCase()) ||
             product.stockIn
               .toString()
               .toLowerCase()
               .includes(this.filterBy.toLowerCase()) ||
             product.stockOut
               .toString()
               .toLowerCase()
               .includes(this.filterBy.toLowerCase())
         ),
       ];
     } else {
       this.filteredProducts = [
         ...this.products.filter((product) =>
           product.code.toString().toLowerCase().includes(this.filterBy.toLowerCase())
         ),
       ];
     }
  }
  getProducts() {
    this.apiService.getProductList().subscribe(
      (data) => {
        console.log("Product List Data:", data);
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
            this.isLoadingCheck = true;
            this.products = data.productList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
            this.filteredProducts = [...this.products];
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
  loadexportdata() {
    if (this.products.length != 0) {
      try {
        let sortArr = [];
        for (let i = 0; i < this.products.length; i++) {
          var newObject = {
            "Product Id": this.products[i]._id,
            "Product Name": this.products[i].name,
            "Available Quantity": this.products[i].availableQuantity,
            "Stock In": this.products[i].stockIn,
            "Stock Out": this.products[i].stockOut,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "ProductInventory_" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  // deleteProduct(id: any) {
  //   this.apiService.deleteProduct(id).subscribe(
  //     (data) => {
  //       console.log("Product Deleted:", data);
  //       if (data.status == 200) {
  //         this.getProducts();
  //       }
  //       if (data != null && data != undefined) {
  //         try {
  //         } catch {}
  //       } else {
  //         this.isLoadingCheck = false;
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.isLoadingCheck = false;
  //     }
  //   );
  // }

  // viewProduct(productId: any) {
  //   // let CategoryName = this.category.get();
  //   $.confirm({
  //     theme: "light",
  //     title: "Product",
  //     content: function () {
  //       var self = this;
  //       return $.ajax({
  //         url: UrlMappings.GetProductById + "?productId=" + productId,
  //         dataType: "json",
  //         method: "get",
  //       })
  //         .done(function (response) {
  //           console.log("Responce from api:::::", self);

  //           self.setContent(`<div class="input-group mb-3">
  //             <div class="input-group-prepend">
  //               <span class="input-group-text" id="basic-addon1">Category</span>

  //             </div>
  //             <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value='${categoryName}'>
  //           </div>
  //           <div class="input-group mb-3">
  //             <div class="input-group-prepend">
  //               <span class="input-group-text" id="basic-addon1">Name</span>
  //             </div>
  //             <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value='${response.product.name}'>
  //           </div>
  //           <div class="input-group mb-3">
  //             <div class="input-group-prepend">
  //               <span class="input-group-text" id="basic-addon1">Price</span>
  //             </div>
  //             <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value='${response.product.price}'>
  //           </div>
  //           <div class="input-group mb-3">
  //             <div class="input-group-prepend">
  //               <span class="input-group-text" id="basic-addon1">Unit</span>
  //             </div>
  //             <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value='${response.product.unit}'>
  //           </div>
  //            `);
  //         })
  //         .fail(function () {
  //           // self.setContent('Something went wrong.');
  //         });
  //     },
  //     onContentReady: function () {
  //       //     $('#search').keyup(function () {
  //       //         $('#result').html('');
  //       //         var searchField = $('#search').val();
  //       //         // console.log(searchField)
  //       //         // console.log(data);
  //       //         var expression = new RegExp(searchField, 'i');
  //       //         $.each(data, function (key, value) {
  //       //             if (searchField == "") {
  //       //                 $("#result").html('');
  //       //                 return;
  //       //             }
  //       //             if (value.name.search(expression) != -1) {
  //       //                 count++
  //       //                 if (count < 10) {
  //       //                     $('#result').append('<li class="list-group-item link-class" style="color:#495057"> ' + value.name + '<span class="text-muted" style="display:none">|' + value.id + '</span></li>');
  //       //                 }
  //       //             }
  //       //         });
  //       //         //console.log(count)
  //       //         count = 0;
  //       //     });
  //       //     $('#result').on('click', 'li', function () {
  //       //         var click_text = $(this).text().split('|');
  //       //         $('#search').val($.trim(click_text[0]));
  //       //         $("#result").html('');
  //       //         console.log($.trim(click_text[0]))
  //       //         console.log($.trim(click_text[1]))
  //       //         this.professionEn = $.trim(click_text[0]);
  //       //         this.professionId = $.trim(click_text[1]);
  //       //     });
  //     },
  //     typeAnimated: true,
  //     draggable: false,
  //     useBootstrap: true,
  //     boxWidth: "600px",
  //     animationBounce: 1.5,
  //     buttons: {
  //       Cancel: {
  //         btnClass: "cancel",
  //         action: function () {
  //           // this.professionId = "";
  //         },
  //       },
  //       Confirm: {
  //         btnClass: "confirm",
  //         action: function () {},
  //       },
  //     },
  //   });
  // }
}
