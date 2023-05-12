import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/navigation/api.service';
import { environment } from "../../../../environments/environment";
@Component({
  selector: "app-default-header",
  templateUrl: "./default-header.component.html",
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);
  user = JSON.parse(localStorage.getItem("user"));
  brandName = this.user.brandName
    .toLowerCase()
    .replace(/(^|\s)[a-z]/g, (L) => L.toUpperCase());
  constructor(
    private router: Router,
    private classToggler: ClassToggleService,
    private apiService: ApiService
  ) {
    console.log("Default.......");
    super();
  }

  logout = () => {
    this.apiService.logout().subscribe(
      (data) => {
        if (data.status == 401) {
          // sessionStorage.setItem('isAuthenticated', '');
          // this.router.navigate(['/connection']);
          // this.isLoading;
        }
        if (data != null && data != undefined) {
          try {
            console.log("logout in");
            localStorage.clear();
            this.router.navigateByUrl("/");
            this.router.navigate(["/login"]);
          } catch {}
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
}
