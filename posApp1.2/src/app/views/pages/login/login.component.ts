import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../../package.json';
import { ApiService } from './../../../services/navigation/api.service';
import { environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userClinics: any = [];
  showErrorModal = false;
  isLogInClicked = false;
  errorMsg = "";

  userData = {
    username: '',
    password: '',
  };

  selectOption: any = 1; 

  version: any = packageJson?.version || '1.0.0';
  constructor(private apiService: ApiService, private router: Router) { }
  
  ngOnInit() {
   // this.fetchAllSites();
  }

  
  authenticateUser(formData: any) {
    this.isLogInClicked = true;

    if (formData.username == '') {
      this.errorMsg = 'Please enter username.';
      return;
    } else if (formData.password == '') {
      this.errorMsg = 'Please enter password.';
      return;
    }

    // if (!this.selectOption) {
    //   this.showErrorModal = true;
    //   return;
    // }
    var authObject = {
      email: formData.username,
      password: formData.password,
    };

    
    if (!localStorage.getItem("user")) {
      this.apiService.authenticateUser(authObject).subscribe((response) => {
        console.log("response", response)
        if (response.status == 200) {
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("isLoggedIn", 'true');
          this.apiService.setDbName(response.user.dbName);
          this.router.navigateByUrl("/");
          //  console.log("User Object : "  + localStorage.getItem("user"));
          //  console.log("User Object 2  : " +JSON.parse(localStorage.getItem('user')));
          // if (localStorage.getItem('authtoken') && this.selectOption !== undefined) {
          //   localStorage.setItem('isAuthtokenValid', true.toString());
          // }
          // alert("Db Name: " + JSON.parse(localStorage.getItem("user")).dbName);
          
          this.router.navigate(['/dashboard']);
        
        } else {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.errorMsg = error.error.msg;
      });
    }
    else {
       this.router.navigate(["/dashboard"]);
    }
  }
  selectedOption() {
    localStorage.setItem('siteId', this.selectOption);
  }
 
  

}
