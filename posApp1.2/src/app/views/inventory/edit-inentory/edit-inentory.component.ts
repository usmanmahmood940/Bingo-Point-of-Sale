import { Component, OnInit } from '@angular/core';
import { switchMap, take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiService } from "../../../services/navigation/api.service";
import { NgForm } from '@angular/forms';

declare var $:any
@Component({
  selector: "app-edit-inentory",
  templateUrl: "./edit-inentory.component.html",
  styleUrls: ["./edit-inentory.component.scss"],
})
export class EditInentoryComponent implements OnInit {
  product = {
    Id: "",
    code:"",
    name: "",
    stockAvailable: "",
    stockIn: "",
    stockOut: "",
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getProductByid();
  }

  getProductByid() {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);

      this.apiService.getProductByID(params["id"]).subscribe(
        (data) => {
          console.log("Product List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              this.product.name = data.product.name;
              this.product.code = data.product.code;
              this.product.stockAvailable = data.product.availableQuantity;
              this.product.stockIn = data.product.stockIn;
              this.product.stockOut = data.product.stockOut;
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

        let updatedProduct = {
          Id: params["id"],
          availableQuantity: this.product.stockAvailable,
          stockIn: this.product.stockIn,
          stockOut: this.product.stockOut,
          user: JSON.parse(localStorage.getItem("user")).name,
        };

        this.apiService.updateProductInventory(updatedProduct).subscribe(
          (data) => {
            console.log("Updated Product  Data:", data);
            if (data.status == 401) {
            }
            if (data != null && data != undefined) {
              try {
                this.router.navigate(["/inventory"]);
                // this.product.stockAvailable = data.product.availableQuantity;
                // this.product.stockIn = data.product.stockIn;
                // this.product.stockOut = data.product.stockOut;
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
      errorDialog("Validation", "Fields are empty");
    }
  }
}

function errorDialog(title:any,msg:any) {
  $.confirm({
    title: title,
    content: msg,
    type: "red",
    typeAnimated: true,
    buttons: {
      close: function () {},
    },
  });
}
