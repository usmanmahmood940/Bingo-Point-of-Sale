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

  receiving = {
    productId: "",
    stockBuy: "",
    discount: "",
    totalAmount: "",
  };

  selectProductId = "";
  products = [];

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      let newReceiving = {
        stockBuy: this.receiving.stockBuy,
        discount: this.receiving.discount,
        totalAmount: this.receiving.totalAmount,
        productId: this.selectProductId,
      };
      this.confirmDialog(
        "Do you want to add this Receiving",
        this.router,
        newReceiving,
        this.apiService
      );
    }
    else {
     this.errorDialog();
    }
  }

  fetchAllProducts() {
    try {
      this.apiService.getProductList().subscribe((response) => {
        console.log("response::", response);
        response.productList.forEach((element: any) => {
          this.products.push({ name: element.name, id: element._id });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  selectedOption(event: any) {
    this.selectProductId = event.target.value;
    console.log(this.selectProductId);
  }

  confirmDialog(this, msg, router, receiving, apiService) {
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
            apiService.addReceiving(receiving).subscribe(
              (data) => {
                console.log("receiving List Data:", data);
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

  addCategory() {}
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
          router.navigate(["/receiving"]);
        },
      },
    },
  });
}