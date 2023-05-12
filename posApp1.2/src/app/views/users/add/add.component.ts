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

  user = {
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
    role: "",
    dbName: "",
    brandName: "",
    salary: "",
    cnic: "",
  };
  selectedRole = "";

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.valid && !(this.selectedRole === "")) {
      const currentUser: any = JSON.parse(localStorage.getItem("user"));
      let newUser = {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        mobileNumber: this.user.mobileNumber,
        address: this.user.address,
        role: this.selectedRole,
        dbName: currentUser.dbName,
        brandName: currentUser.brandName,
        salary: this.user.salary,
        cnic: this.user.cnic,
      };
      this.confirmDialog(
        "Do you want to add this User",
        this.router,
        newUser,
        this.apiService
      );
    } else {
      if (this.user.mobileNumber.length != 11) {
        this.errorDialog("Validation", "Mobile number sholud be of 11 digits");
      } else if (this.user.cnic.length != 13) {
        this.errorDialog("Validation", "CNIC sholud be of 13 digits");
      } else {
        this.errorDialog("Validation", "Fields are empty");
      }
    }
  }

  confirmDialog(this, msg, router, user, apiService) {
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
            apiService.addUser(user).subscribe(
              (data) => {
                console.log("User List Data:", data);
                if (data.status == 200) {
                  try {
                    successDialog(data.message, router);
                  } catch {}
                } else {
                  console.log("User add nhi hu raha bhai koe panga hy");
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
  errorDialog(title, content) {
    $.confirm({
      title: title,
      content: content,
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

  onlyNumberKey($event) {
    // Only ASCII character in that range allowed
    var ASCIICode = $event.which ? $event.which : $event.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      // this.errorMsg = "Enter only Number";
      return false;
    }
    return true;
  }
  onlyNumberKeyCnic($event) {
    // Only ASCII character in that range allowed
    var ASCIICode = $event.which ? $event.which : $event.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      // this.errorMsg = "Enter only Number";
      return false;
    }
    return true;
  }

  selectedOption(event: any) {
    this.selectedRole = event.target.value;
    console.log(this.selectedRole);
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
          router.navigate(["/users"]);
        },
      },
    },
  });
}
