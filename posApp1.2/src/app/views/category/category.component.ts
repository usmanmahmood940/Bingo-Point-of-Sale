import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { ProductsComponent } from "../products/products.component";
//import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  categoryList: Array<any>;
  isLoadingCheck = false;
  filteredCategory: any[];
  filterBy;

  constructor(protected apiService: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  isLoading() {
    if (
      this.isLoadingCheck
    )
      return false;
    else return true;
  }

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.getCategories();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCategories();
  }

  filter() {
    this.filteredCategory = [
      ...this.categoryList.filter(
        (category) =>
          category.name.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          category.detail.toLowerCase().includes(this.filterBy.toLowerCase())
      ),
    ];
  }
  getCategories() {
      this.apiService.getCategoryList().subscribe(
        (data) => {
          console.log("Category List Data:", data);
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
              this.categoryList = data.categoryList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
              this.filteredCategory = [...this.categoryList];
              // if (this.pageNum < this.MaxPage-1)
              //   this.isNext = false;
              // else
              //   this.isNext = true;

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

  deleteCategory(id: any) {
    this.isLoadingCheck = false;
    this.apiService.deleteCategory(id).subscribe(
      (data) => {
        console.log("Product Deleted:", data);
        if (data.status == 200) {
          this.getCategories();
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
  categoryInUse(id: any) {
    this.apiService.getProductByCategory(id).subscribe(
      (data) => {
        console.log("Products by Category List Data:", data);
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
          // this.isLoadingCheck;
        }
        if (data != null && data != undefined) {
          try {
            if (data.count > 0) {
              $.confirm({
                title: "Failure",
                content: "Category In Use",
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
                    
          text: "Confirm",
          btnClass: "btn-green",

                    action: () => this.deleteCategory(id),
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

  loadexportdata() {
    if (this.categoryList.length != 0) {
      try {
        let sortArr = [];
        for (let i = 0; i < this.categoryList.length; i++) {
          var newObject = {
            "Category Id": this.categoryList[i]._id,
            "Category Name": this.categoryList[i].name,
            "Category Detail": this.categoryList[i].detail,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "Category_Reports" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }
}
