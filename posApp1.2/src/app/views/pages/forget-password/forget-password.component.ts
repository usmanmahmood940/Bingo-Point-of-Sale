import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../services/navigation/api.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
declare var $: any;
@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  email = "";

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      let body = {
        email: this.email,
      };
      this.confirmDialog(
        "Link Will Send To This Mail",
        this.router,
        body,
        this.apiService
      );
    } else {
      this.errorDialog();
    }
  }
  

  confirmDialog(this, msg, router, body, apiService) {
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
            apiService.forgetPassword(body).subscribe(
              (data) => {
                console.log("Expsnes List Data:", data);
                if (data.status == 200) {
                  try {
                    successDialog(data.msg, router);
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
      content: "Field is empty",
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
          router.navigate(["/login"]);
        },
      },
    },
  });
}

