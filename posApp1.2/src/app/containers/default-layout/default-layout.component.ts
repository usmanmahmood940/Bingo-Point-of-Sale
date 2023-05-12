import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { navItemsAdmin, navItemsCashier, navItemsMasterAdmin } from "./_nav";
import { Location } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {
  public navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit() {
    let url = this.location.prepareExternalUrl(this.location.path());

    const user: any = JSON.parse(localStorage.getItem("user"));
    if (user.role === "masterAdmin") {
      this.navItems = navItemsMasterAdmin;
      if (url === "/bingoPOS/" || url === "/bingoPOS") {
        this.location.go("/");
        this.router.navigate(["/dashboard"]);
      }
    } else if (user.role === "admin") {
        this.navItems = navItemsAdmin;
      if (url === "/bingoPOS/" || url === "/bingoPOS") {
          this.location.go("/");
          this.router.navigate(["/sales"]);
        }
    } else {
      this.navItems = navItemsCashier;
      if (url === "/bingoPOS/" || url === "/bingoPOS") {
        this.location.go("/");
        this.router.navigate(["/sales"]);
      }
    }
  }
}
