import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../services/navigation/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
declare var $: any;
@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  user = {
    id: "",
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
    role: "",
    salary: "",
    cnic: "",
  };
  roles=[];

  selectedRole = "";
  

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);
      this.user.id = params["id"];
      this.apiService.getUserByID(params["id"]).subscribe(
        (data) => {
          console.log("User List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              this.user.name = data.user.name;
              this.user.email = data.user.email;
              this.user.password = data.user.password;
              this.user.cnic = data.user.cnic;
              this.user.mobileNumber = data.user.mobileNumber;
              this.selectedRole = data.user.role;
              this.user.salary = data.user.salary;
              this.user.address = data.user.address;
              this.roles.push(this.selectedRole);
              if (this.roles[0] === "admin") {
                this.roles[1] = "cashier";
              } else {
                 this.roles[1] = "admin";
              }
              
              console.log("AB ye naya user :: " + this.user.salary);
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
      const currentUser: any = JSON.parse(localStorage.getItem("user"));
      let newUser = {
        userId: this.user.id,
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        mobileNumber: this.user.mobileNumber,
        address: this.user.address,
        role: this.selectedRole,
        salary: this.user.salary,
        cnic: this.user.cnic,
      };
      this.confirmDialog(
        "Do you want to Update this User",
        this.router,
        newUser,
        this.apiService
      );
    } else {
      if (
        this.user.mobileNumber.length != 11 ||
        this.user.mobileNumber === undefined
      ) {
        this.errorDialog("Validation", "Mobile number sholud be of 11 digits");
      } else if (this.user.cnic.length != 13 || this.user.cnic === undefined) {
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
            apiService.updateUser(user).subscribe(
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
