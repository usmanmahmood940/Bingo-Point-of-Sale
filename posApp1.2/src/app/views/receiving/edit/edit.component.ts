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
  receiving = {
    productId: "",
    stockBuy: "",
    discount: "",
    totalAmount: "",
    productName:""
  };

  // selectProductId: any;
  // products = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getReceivingByid();
    
  }

  getReceivingByid() {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);

      this.apiService.getReceivingById(params["id"]).subscribe(
        (data) => {
          console.log("Receiving List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              this.receiving.stockBuy = data.receiving.stockBuy;
              this.receiving.productId = data.receiving._productId;
              this.receiving.discount = data.receiving.discount;
              this.receiving.totalAmount = data.receiving.totalAmount;
              this.getProductById(this.receiving.productId);
            } catch {}
          } else {
            this.apiService.errorDialog(
              "Operation Failed",
              "Some Error Occured"
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
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.route.params.subscribe((params) => {
        console.log(params["id"]); //log the value of id

        let updatedReceiving = {
          receivingId: params["id"],
          productId: this.receiving.productId,
          stockBuy: this.receiving.stockBuy,
          discount: this.receiving.discount,
          totalAmount: this.receiving.totalAmount,
        };
        console.log("product that will update " + updatedReceiving);

        this.apiService.updateReceiving(updatedReceiving).subscribe(
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

                this.router.navigate(["/receiving"]);
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
    } else {
      this.apiService.errorDialog("Validation", "Fields are empty");
    }
  }

  getProductById(productId) {
    try {
      this.apiService.getProductByID(productId).subscribe((response) => {
        console.log("response::", response);
        this.receiving.productName = response.product.name;
      });
    } catch (error) {
      console.error(error);
    }
  }

  // selectedOption(event: any) {
  //   this.selectProductId = event.target.value;
  //   console.log(this.selectProductId + "  " + typeof this.selectProductId);
  // }
}
