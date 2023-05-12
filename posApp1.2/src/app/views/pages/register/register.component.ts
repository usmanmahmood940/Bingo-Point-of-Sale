import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import packageJson from '../../../../../package.json';
import { ApiService } from './../../../services/navigation/api.service';
declare var $: any;


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  showErrorModal = false;
  isLogInClicked = false;
  errorMsg = "";
  mailAvailable = false;
  dbAvailable = false;

  userData = {
    name: "",
    email: "",
    role: "masterAdmin",
    password: "",
    confirmPassword: "",
    brandName: "",
    dbName: "",
    mobileNumber: "",
  };

  signUp(formData: any, form: NgForm) {
    this.isLogInClicked = true;
    if (!form.valid) {
      this.errorMsg = "Form is not valid";
      return;
    } else if (formData.name == "") {
      this.errorMsg = "Please enter username.";
      return;
    } else if (formData.password == "") {
      this.errorMsg = "Please enter password.";
      return;
    } else if (!this.mailAvailable) {
      this.errorMsg =
        "The email address you have entered is already associated with another account.";
      return;
    } else if (!this.dbAvailable) {
      this.errorMsg =
        "The dbName you have entered is already associated with another account.";
      return;
    }
    else if (formData.mobileNumber.length!=11) {
      this.errorMsg =
        "Enter 11 digit mobile number.";
      return;
    }

    if (this.checkPasswords()) {
      try {
        var userData = {
          name: formData.name,
          email: formData.email,
          role: "masterAdmin",
          password: formData.password,
          brandName: formData.brandName,
          dbName: formData.dbName,
          mobileNumber: formData.mobileNumber,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        this.apiService.signUp(userData).subscribe(
          (response) => {
            console.log("response", response);
            if (response.status == 500) {
              this.errorMsg = response.msg;
            } else if (response.status == 200) {
              // localStorage.setItem('authtoken', response._id);
              // localStorage.setItem('name', response.name);
              // localStorage.setItem('email', response.email);
              // localStorage.setItem('role', response.role);

              // if (localStorage.getItem('authtoken') && this.selectOption !== undefined) {
              //   localStorage.setItem('isAuthtokenValid', true.toString());
              // }
              successDialog(response.msg, this.router);
            } else {
              this.router.navigate(["/register"]);
            }
          },
          (error) => {
            this.errorMsg = error.error.msg;
            // this.errorMsg = 'Login failed. Please verify username and password.';
            // console.log(error);
          }
        );
      } catch (error) {}
    } else {
      this.errorMsg =
        "Unable to SignUp. Password & Confirm Password does not match.";
    }
  }

  checkEmail(formData: any) {
    this.apiService.checkEmail(formData.email).subscribe(
      (response) => {
        console.log("response", response);
        if (response.status == 500) {
          this.errorMsg = response.msg;
        } else if (response.status == 200) {
          // localStorage.setItem('authtoken', response._id);
          // localStorage.setItem('name', response.name);
          // localStorage.setItem('email', response.email);
          // localStorage.setItem('role', response.role);

          // if (localStorage.getItem('authtoken') && this.selectOption !== undefined) {
          //   localStorage.setItem('isAuthtokenValid', true.toString());
          // }
          if (response.isExist) {
            this.mailAvailable = false;
            this.errorMsg =
              "The email address you have entered is already associated with another account.";
          } else {
            this.mailAvailable = true;
            this.errorMsg = "";
          }
        } else {
          this.router.navigate(["/register"]);
        }
      },
      (error) => {
        // this.errorMsg = 'Login failed. Please verify username and password.';
        // console.log(error);
      }
    );
  }
  onlyNumberKey($event) {
    // Only ASCII character in that range allowed
    var ASCIICode = $event.which ? $event.which : $event.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) { 
      this.errorMsg = "Enter only Number";
    return false;
  }
    return true;
  }
  checkDbName(formData: any) {
    this.apiService.checkDbName(formData.dbName).subscribe(
      (response) => {
        console.log("response", response);
        if (response.status == 500) {
          this.errorMsg = response.msg;
        } else if (response.status == 200) {
          // localStorage.setItem('authtoken', response._id);
          // localStorage.setItem('name', response.name);
          // localStorage.setItem('email', response.email);
          // localStorage.setItem('role', response.role);

          // if (localStorage.getItem('authtoken') && this.selectOption !== undefined) {
          //   localStorage.setItem('isAuthtokenValid', true.toString());
          // }
          if (response.isExist) {
            this.dbAvailable = false;
            this.errorMsg =
              "The dbName you have entered is already associated with another account.";
          } else {
            this.dbAvailable = true;
            this.errorMsg = "";
          }
        } else {
          this.router.navigate(["/register"]);
        }
      },
      (error) => {
        // this.errorMsg = 'Login failed. Please verify username and password.';
        // console.log(error);
      }
    );
  }

  checkPasswords() {
    // here we have the 'passwords' group
    const password = this.userData.password;
    const confirmPassword = this.userData.confirmPassword;

    return password === confirmPassword ? true : false;
  }

  isDisable() {
    if (
      this.userData.name != "" &&
      this.userData.email != "" &&
      this.userData.password != "" &&
      this.userData.dbName != "" &&
      this.userData.brandName != ""
    ) {
      return false;
    }
    return true;
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

// if (this.checkPasswords()) {
//   try {

//     let body = { "oldPassword": this.userData.oldPassword, "newPassword": this.userData.newPassword }

//     this.apiService.changePassword(body).subscribe(data => {
//       console.log(data);

//       // if (data.responsecode == 401) {
//       //   // sessionStorage.setItem('isAuthenticated', '');
//       //   // this.router.navigate(['/connection']);
//       // }
//       if (data) {
//         try {
//           console.log(data);
//           this.alert.showSuccuss = true;
//           this.userData.oldPassword = "";
//           this.userData.newPassword = "";
//           this.userData.consfirmPassword = "";
//         }
//         catch
//         {
//         }

//       }
//       else {
//         this.alert.showError = true;
//       }
//     }, error => {
//       console.log(error);
//       this.alert.showError = true;
//       // this.alert.data = 
//     });

//   } catch { }
// }
// else {
//   this.userData.show = true;
// }