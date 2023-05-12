import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiService } from '../services/navigation/api.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $:any;
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  // updatePasswordForm: FormGroup;
  // oldPassword: FormControl;
  // newPassword: FormControl;
  // cnewPassword: FormControl;

  userData = {
    newPassword: "",
    consfirmPassword: "",
    show: false,
  };

  response: string;
  alert = {
    data: "",
    showSuccuss: false,
    showError: false,
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.oldPassword = new FormControl('', [Validators.required]);
    // this.newPassword = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]);
    // this.cnewPassword = new FormControl('', [Validators.required]);
    // this.updatePasswordForm = this.fb.group({
    //   oldPassword: this.oldPassword,
    //   newPassword: this.newPassword,
    //   cnewPassword: this.cnewPassword
    // });
    // this.updatePasswordForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   title: ['', Validators.required],
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    //   confirmPass: ['', Validators.required]
    // }, { validator: this.checkIfMatchingPasswords('password', 'confirmPass') });
  }

  // onSubmit(form: NgForm) {
  //   this.alert.showSuccuss = false;
  //   this.alert.showError = false;
  //   this.userData.show = false;

  //   console.log(this.userData.oldPassword, this.userData.newPassword);

  //   if (this.checkPasswords()) {
  //     try {
  //       let body = {
  //         oldPassword: this.userData.oldPassword,
  //         newPassword: this.userData.newPassword,
  //       };

  //       this.apiService.changePassword(body).subscribe(
  //         (data) => {
  //           console.log(data);

  //           // if (data.responsecode == 401) {
  //           //   // sessionStorage.setItem('isAuthenticated', '');
  //           //   // this.router.navigate(['/connection']);
  //           // }
  //           if (data) {
  //             try {
  //               console.log(data);
  //               this.alert.showSuccuss = true;
  //               this.userData.oldPassword = "";
  //               this.userData.newPassword = "";
  //               this.userData.consfirmPassword = "";
  //             } catch {}
  //           } else {
  //             this.alert.showError = true;
  //           }
  //         },
  //         (error) => {
  //           console.log(error);
  //           this.alert.showError = true;
  //           // this.alert.data =
  //         }
  //       );
  //     } catch {}
  //   } else {
  //     this.userData.show = true;
  //   }
  // }
  onSubmit(form: NgForm) {
    this.route.params.subscribe((params) => {
      if (form.valid) {
        if (this.checkPasswords()) {
          let body = {
            userId: params["id"],
            password: this.userData.consfirmPassword,
          };

          this.confirmDialog(
            "Do you want to change the password",
            this.router,
            body,
            this.apiService
          );
        } else {
          this.errorDialog("Password does not match");
        }
      } else {
        this.errorDialog("Fields are empty");
      }
    });
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
            apiService.updatePassword(body).subscribe(
              (data) => {
                console.log(" Updated User:", data);
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
  errorDialog(msg:any) {
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
  checkPasswords() {
    // here we have the 'passwords' group
    const password = this.userData.newPassword;
    const confirmPassword = this.userData.consfirmPassword;

    return password === confirmPassword ? true : false;
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
