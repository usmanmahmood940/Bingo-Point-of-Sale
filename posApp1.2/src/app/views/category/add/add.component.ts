import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/navigation/api.service";
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
declare var $: any;
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  category = {
    Id: "",
    name: "",
    detail: "",
  };

  ngOnInit(): void {}

  onSubmit(form:NgForm) {
    if (form.valid) {
      let category = {
        name: this.category.name,
        detail: this.category.detail,
      };
      this.confirmDialog(
        "Do you want to add this Category",
        this.router,
        category,
        this.apiService
      );
    }
    else {
       this.errorDialog();
    }
  }
  confirmDialog(this, msg, router, category, apiService) {
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
            apiService.addCategory(category).subscribe(
              (data) => {
                console.log("Product List Data:", data);
                if (data.status == 200) {
                  try {
                    successDialog(data.message, router);
                  } catch {}
                } else {
                  apiService.errorDialog("Operation Failed", "Some Error occured");
    
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
      content: "Fields Are Empty",
      type: "red",
      typeAnimated: true,
      buttons: {
      
        close: function () {},
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
          router.navigate(["/category"]);
        },
      },
    },
  });
}