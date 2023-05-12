import { Component, OnInit } from "@angular/core";

import { switchMap, take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiService } from "../../../services/navigation/api.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  expense = {
    expenseId: "",
    name: "",
    detail: "",
    amount: "",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getExpenseByid();
  }

  getExpenseByid() {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);

      this.apiService.getExpensesById(params["id"]).subscribe(
        (data) => {
          console.log("Expense List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              this.expense.name = data.expense.name;
              this.expense.detail = data.expense.detail;
              this.expense.amount = data.expense.amount;
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.route.params.subscribe((params) => {
        console.log(params["id"]); //log the value of id

        let updatedExpense = {
          expenseId: params["id"],
          name: this.expense.name,
          detail: this.expense.detail,
          amount: this.expense.amount,
        };
        console.log("product that will update " + updatedExpense);

        this.apiService.updateExpenses(updatedExpense).subscribe(
          (data) => {
            console.log("Product List Data:", data);
            if (data.status == 401) {
            }
            if (data != null && data != undefined) {
              try {
                //   this.product.name = data.product.name;
                // this.product._categoryId = data.product._categoryId;
                // this.product.price = data.product.price;
                // this.product.unit = data.product.unit;

                this.router.navigate(["/expenses"]);
              } catch {}
            } else {
              this.apiService.errorDialog(
                "Operation Failed",
                "Some erro occured"
              );

              // this.isLoading = false;
            }
          },
          (error) => {
            console.log(error);
            // this.isLoading = false;
          }
        );
      });
    } else {
      this.apiService.errorDialog("Validation", "Fields are empty");
    }
  }

}
