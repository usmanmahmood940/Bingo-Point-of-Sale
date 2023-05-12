import { Component, OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import packageJson from "../../../../../package.json";
import { ApiService } from "./../../../services/navigation/api.service";

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"],
})
export class ConfirmationComponent implements OnInit {

  message = "";
  check = false;
  constructor(private apiService: ApiService, private router: Router,private route: ActivatedRoute,) {}

  ngOnInit(): void { 
    this.confirmation();
  }
  
  confirmation() {
    this.route.params.subscribe((params) => {
      let body = {
        userId: params["id"]
      }
      this.apiService.confirmation(body).subscribe(
        (data) => {
          console.log("Response:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              //   this.product.name = data.product.name;
              // this.product._categoryId = data.product._categoryId;
              // this.product.price = data.product.price;
              // this.product.unit = data.product.unit;
              this.message = data.msg;
              this.check = true;
              // this.router.navigate(["/expenses"]);
            } catch {}
          } else {
            // this.isLoading = false;
          }
        },
        (error) => {
          this.message = error.error.msg;
          this.check = true;
          console.log(error);
          // this.isLoading = false;
        }
      );
    });
  }
}
