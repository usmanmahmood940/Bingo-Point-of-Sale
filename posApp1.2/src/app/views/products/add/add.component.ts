import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/navigation/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  product = {
    Id: "",
    code:"",
    name: "",
    detail: "",
    unit: "",
    _categoryId: "",
    price: "",
  };

  selectCatogeryId = "";
  categories = [];

  ngOnInit(): void {
    this.fetchAllCategory();
  }


  onSubmit(form: NgForm) {
    if (form.valid && !(this.selectCatogeryId === "")) {
      let updatedProduct = {
        code: this.product.code,
        name: this.product.name,
        detail: this.product.detail,
        unit: this.product.unit,
        categoryId: this.selectCatogeryId,
        price: this.product.price,
        user: JSON.parse(localStorage.getItem("user")).name,
      };
      this.confirmDialog(
        "Do you want to add this Product",
        this.router,
        updatedProduct,
        this.apiService
      );
    } else {
      errorDialog("Validation", "Fields are empty");
    }
  }

  fetchAllCategory() {
    try {
      this.apiService.getCategoryList().subscribe((response) => {
        console.log("response::", response);
        response.categoryList.forEach((element: any) => {
          this.categories.push({ category: element.name, id: element._id });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  selectedOption(event: any) {
    this.selectCatogeryId = event.target.value;
    console.log(this.selectCatogeryId);
  }

  confirmDialog(this, msg, router, product, apiService) {
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
            apiService.addProduct(product).subscribe(
              (data) => {
                console.log("Product List Data:", data);
                if (data.status == 200) {
                  try {
                    successDialog(data.message, router);
                  } catch {}
                } else {
                  errorDialog("Operation Failed",data.message);
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
          router.navigate(["/products"]);
        },
      }
    },
  });
}

