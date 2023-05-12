import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";

import { ApiService } from "../../../services/navigation/api.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-category.component.html",
  styleUrls: ["./edit-category.component.scss"],
})
export class EditCategoryComponent implements OnInit {
  category = {
    Id: "",
    name: "",
    detail: "",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.getCategoryByid();
  }

  getCategoryByid() {
    this.route.params.subscribe((params) => {
      console.log(params["id"]);

      this.apiService.getCategoryById(params["id"]).subscribe(
        (data) => {
          console.log("Categeory List Data:", data);
          if (data.status == 401) {
          }
          if (data != null && data != undefined) {
            try {
              this.category.name = data.category.name;
              this.category.detail = data.category.detail;
              
              
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
      this.route.params.subscribe((params) => {
        console.log(params["id"]); //log the value of id

        let updatedCategory = {
          categoryId: params["id"],
          name: this.category.name,
          detail: this.category.detail,
        };

        this.apiService.updateCategory(updatedCategory).subscribe(
          (data) => {
            console.log("Category List Data:", data);
            if (data.status == 401) {
            }
            if (data != null && data != undefined) {
              try {
                this.category.name = data.category.name;
                this.category.detail = data.category.detail;
                this.router.navigate(["/category"]);
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
    } else {
      this.apiService.errorDialog("Validation", "Fields are empty");
    }
  }
}
