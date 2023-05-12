import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.scss"],
})
export class ExpensesComponent implements OnInit {
  constructor(protected apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getExpesnses();
  }
  expenses = [];
  filteredExpenses: any[];
  filterBy;
  isLoadingCheck;
  startDate;
  endDate;

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }

  getExpensesByFilter(start, end) {
    if (end > start) {
      this.isLoadingCheck = false;
      this.apiService.getExpenseByFilter(start, end).subscribe(
        (data) => {
          console.log("Expenses List Data:", data);
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

              this.expenses = data.expenseList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
              this.filteredExpenses = [...this.expenses];
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

  isLoading() {
    if (this.expenses.length > 0 || this.isLoadingCheck) return false;
    else return true;
  }
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.getExpesnses();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getExpesnses();
  }
  filter() {
    this.filteredExpenses = [
      ...this.expenses.filter(
        (expense) =>
          this.apiService
            .getDateFormat(expense.createdAt)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          this.apiService
            .getTime(expense.createdAt)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          expense.name.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          expense.detail.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          expense.amount
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
      ),
    ];
  }

  getExpesnses() {
    this.apiService.getExpensesList().subscribe(
      (data) => {
        console.log("Expenses List Data:", data);
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

            this.expenses = data.expenseList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
            this.filteredExpenses = [...this.expenses];
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
        this.isLoadingCheck = true;
        console.log(error);
      }
    );
  }

  addExpense() {
    this.router.navigate(["/expenses/add"]);
  }

  viewExpense(expenseId: any, apiService: ApiService) {
    // let CategoryName = this.category.get();
    $.confirm({
      theme: "light",
      title: "<strong class='title-bold'>Expense</strong>",
      content: function () {
        var self = this;
        var user = JSON.parse(localStorage.getItem("user"));
        var dbName = user.dbName;
        return $.ajax({
          url:
            UrlMappings.GetExpensesById +
            "?dbName=" +
            dbName +
            "&" +
            "expenseId=" +
            expenseId,
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
          
            <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Title</label>
        <input type="text" id="name" class="form-control" value='${
          response.expense.name
        }' readonly>
      </div>
      
            <div class="col-md-6">
        <label for="detail" class="form-label">Detail</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.expense.detail
        }' readonly >
      </div>
      
      
       <div class="col-md-6">
        <label for="disabledTextInput" class="form-label">Date</label>
        <input type="text" id="name" class="form-control" value='${apiService.getDateFormat(
          response.expense.createdAt
        )}' readonly>
      </div>
      
        <div class="col-md-6">
        <label for="detail" class="form-label">Time</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${apiService.getDateFormat(
          response.expense.createdAt
        )}' readonly>
        </div>
        
        <div class="col-12" >
        <label for="disabledTextInput" class="form-label">Amount</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.expense.amount
        }' readonly>
        </div>
        <div class="col-12" >
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
      animationBounce: 1.5,
      buttons: {
        Close: {
          text: "Close",
          action: function () {},
        },
      },
    });
  }

  deleteExpense(id: any) {
    this.apiService.deleteExpenses(id).subscribe(
      (data) => {
        console.log("Expense Deleted:", data);
        if (data.status == 200) {
          this.getExpesnses();
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

  loadexportdata() {
    if (this.expenses.length != 0) {
      try {
        let sortArr = [];
        let product: any;
        let data: any;
        for (let i = 0; i < this.expenses.length; i++) {
          var newObject = {
            "Expense Id": this.expenses[i]._id,
            "Title ": this.expenses[i].name,
            "Detail ": this.expenses[i].detail,
            Date: this.apiService.getDateFormat(this.expenses[i].createdAt),
            Time: this.apiService.getTime(this.expenses[i].createdAt),
            "Total Amount": this.expenses[i].amount,
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "ExpenseListReport" + formatDate(new Date(), "dd/MM/yyyy", "en"),
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
          action: () => this.deleteExpense(id),
        },
        close: {
          text: "close",
          action: function () {},
        },
      },
    });
  }
}
