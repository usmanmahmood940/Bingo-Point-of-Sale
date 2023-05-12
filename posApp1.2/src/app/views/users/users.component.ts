import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { UrlMappings } from "../../../app/services/navigation/url.mappings";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  constructor(protected apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }
  users = [];
  filteredUsers: any[];
  filterBy;
  isLoadingCheck;

  sortField = "name";
  sortDirection = "asc";

  sort(field: string) {
    this.sortField = field;
    if (this.sortDirection === "asc") this.sortDirection = "desc";
    else this.sortDirection = "asc";
  }

  isLoading() {
    if (this.users.length > 0 || this.isLoadingCheck) return false;
    else return true;
  }
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  onTableDataChange(event: any) {
    this.page = event;
    this.getUsers();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getUsers();
  }

  filter() {
    this.filteredUsers = [
      ...this.users.filter(
        (user) =>
          this.apiService
            .getDateFormat(user.createdAt)
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          user.name.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          user.email.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          user.role.toLowerCase().includes(this.filterBy.toLowerCase()) ||
          user.salary
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase()) ||
          user.mobileNumber
            .toString()
            .toLowerCase()
            .includes(this.filterBy.toLowerCase())
      ),
    ];
  }

  getUsers() {
    const dbName: any = JSON.parse(localStorage.getItem("user")).dbName;
    this.apiService.getUsersList(dbName).subscribe(
      (data) => {
        console.log("Users List Data:", data);
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

            this.users = data.userList; //.slice((this._page - 1) * this._pageSize, (this._page - 1) * this._pageSize + this._pageSize);
            this.filteredUsers = [...this.users];
            this.isLoadingCheck = true;
            // if (this.pageNum < this.MaxPage-1)
            //   this.isNext = false;
            // else
            //   this.isNext = true;
            // console.log("New sales " + this.receivings.at(0).totalAmount);
          } catch {}
        } else {
          this.isLoadingCheck = true;
        }
      },
      (error) => {
        this.isLoadingCheck = true;
        console.log(error);
      }
    );
  }

  addUser() {
    this.router.navigate(["/users/add"]);
  }

  viewUser(userId: any, apiService: ApiService) {
    // let CategoryName = this.category.get();
    $.confirm({
      theme: "light",
      title: "<strong class='title-bold'>User</strong>",
      content: function () {
        var self = this;
        return $.ajax({
          url: UrlMappings.userById + "?userId=" + userId,
          dataType: "json",
          method: "get",
        })
          .done(function (response) {
            console.log("Responce from api:::::", self);
            console.log("User data" + JSON.stringify(response.user));
            self.setContent(`
            <style>
              label{
                  font-weight: bold;
              }
            </style>
            <div class="row g-3">
          
            <div class="col-12">
        <label for="disabledTextInput" class="form-label">Name</label>
        <input type="text" id="name" class="form-control" value='${
          response.user.name
        }' readonly>
      </div>
      
            <div class="col-12">
        <label for="detail" class="form-label">Email</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.user.email
        }' readonly >
      </div>
      
      
       <div class="col-12">
        <label for="disabledTextInput" class="form-label">Mobile Number</label>
        <input type="text" id="name" class="form-control" value='${
          response.user.mobileNumber
        }' readonly>
      </div>
      <div class="col-md-6">
        <label for="detail" class="form-label">Role</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.user.role
        }' readonly>
        </div>
        <div class="col-md-6">
        <label for="detail" class="form-label">Salary</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.user.salary
        }' readonly>
        </div>

         <div class="col-12" >
        <label for="disabledTextInput" class="form-label">CNIC</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.user.cnic
        }' readonly>
        </div>
        <div class="col-12" >
        <label for="disabledTextInput" class="form-label">Address</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${
          response.user.address
        }' readonly>
        </div>
        </div>
        <label for="disabledTextInput" class="form-label">Hire Date</label>
        <input type="text" id="disabledTextInput" class="form-control" value='${apiService.getDateFormat(
          response.user.createdAt
        )}' readonly>
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

  // deleteExpense(id: any) {
  //   this.apiService.deleteExpenses(id).subscribe(
  //     (data) => {
  //       console.log("Expense Deleted:", data);
  //       if (data.status == 200) {
  //         this.getUsers();
  //       }
  //       if (data != null && data != undefined) {
  //         try {
  //         } catch {}
  //       } else {
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  loadexportdata() {
    if (this.users.length != 0) {
      try {
        let sortArr = [];
        let product: any;
        let data: any;
        for (let i = 0; i < this.users.length; i++) {
          var newObject = {
            "User Id": this.users[i]._id,
            "Name ": this.users[i].name,
            "Mobile Number ": this.users[i].mobileNumber,
            "Email ": this.users[i].email,
            "Role ": this.users[i].role,
            "Address ": this.users[i].address,
            Date: this.apiService.getDateFormat(this.users[i].createdAt),
            Time: this.apiService.getTime(this.users[i].createdAt),
            
          };
          sortArr.push(newObject);
        }

        // this.exportdata.push(...sortArr);
        this.apiService.exportToCsv(
          "UsersListReport" + formatDate(new Date(), "dd/MM/yyyy", "en"),
          sortArr
        );
      } catch {}
    }
  }

  // confirmDialog(id: any) {
  //   $.confirm({
  //     title: "Delete",
  //     content: "Do you want to delete this record",
  //     type: "Green",
  //     typeAnimated: true,
  //     buttons: {
  //       yes: {
  //         text: "confirm",
  //         btnClass: "btn-green",
  //         action: () => this.deleteUser(id),
  //       },
  //       close: {
  //         text: "close",
  //         action: function () {},
  //       },
  //     },
  //   });
  // }
}
