import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/navigation/api.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { error } from "console";
declare var $: any;

@Component({
  selector: "app-help-support",
  templateUrl: "./help-support.component.html",
  styleUrls: ["./help-support.component.scss"],
})
export class HelpSupportComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  help = {
    email: "",
    message: "",
    
  };

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      let newhelp = {
        email: this.help.email,
        message: this.help.message,
      };
      this.confirmDialog(
        "Do you want to Send This Message",
        this.router,
        newhelp,
        this.apiService
      );
    } else {
      this.errorDialog();
    }
  }

  confirmDialog(this, msg, router, feedback, apiService) {
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
            apiService.sendFeedback(feedback).subscribe(
              (data) => {
                if (data.status == 200) {
                  try {
                    successDialog(data.message, router);
                  } catch {}
                } else {
                  errorDialog(data.message);
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

function errorDialog(msg) {
  $.confirm({
    title: "Validation",
    content: msg,
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
          router.navigate(["/help"]);
        },
      },
    },
  });
}
