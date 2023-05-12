import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../services/navigation/api.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  expense = {
    expenseId: "",
    name: "",
    detail: "",
    amount: "",
  };


  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      let newExpense = {
        name: this.expense.name,
        detail: this.expense.detail,
        amount: this.expense.amount,
      };
      this.confirmDialog(
        "Do you want to add this Expense",
        this.router,
        newExpense,
        this.apiService
      );
    } else {
      this.errorDialog();
    }
  }

 

  confirmDialog(this, msg, router, expense, apiService) {
    $.confirm({
      title: "Confirm",
      content: msg,
      type: "Green",
      typeAnimated: true,
      buttons: {
        tryAgain: {
          text: "Confirm",
          btnClass: "btn-green",
          action: function () {
            apiService.addExpenses(expense).subscribe(
              (data) => {
                console.log("Expsnes List Data:", data);
                if (data.status == 200) {
                  try {
                    successDialog(data.message, router);
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
          },
        },
        close: function () {},
      },
    });
  }
  errorDialog() {
    $.confirm({
      title: "Validation",
      content: "Fields are empty",
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
function successDialog(message: any, router: any) {
  $.confirm({
    title: "Succuss",
    content: message,
    type: "Green",
    typeAnimated: true,
    buttons: {
      Ok: {
        text: "ok",
        btnClass: "btn-green",
        action: function () {
          router.navigate(["/expenses"]);
        },
      },
    },
  });
}
