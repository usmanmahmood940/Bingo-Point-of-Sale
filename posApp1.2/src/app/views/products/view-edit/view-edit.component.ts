import { Component, OnInit } from '@angular/core';

import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../../services/navigation/api.service';
import { NgForm } from '@angular/forms';

declare var $:any
@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {

  product = {
    Id: '',
    code:'',
    name: '',
    detaill: '',
    unit: '',
    _categoryId: '',
    price: '',
  };

  selectCatogeryId = '';
  categories = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getProductByid();
    this.fetchAllCategory();
  }

  getProductByid() {
    this.route.params.subscribe(params => {
      console.log(params['id'])

      this.apiService.getProductByID(params['id']).subscribe(data => {
        console.log("Product List Data:", data)
        if (data.status == 401) {

        }
        if (data != null && data != undefined) {
          try {
            this.product.code = data.product.code;
            this.product.name = data.product.name;
            this.product._categoryId = data.product._categoryId;
            this.selectCatogeryId = data.product._categoryId;
            this.product.price = data.product.price;
            this.product.unit = data.product.unit;
          }
          catch
          {

          }

        }
        else {
          // this.isLoading = false;
        }
      }, error => {
        console.log(error);
        // this.isLoading = false;
      });
    });
  }

  onSubmit(form:NgForm) {
    if (form.valid) {
      this.route.params.subscribe(params => {
        console.log(params['id']) //log the value of id

        let updatedProduct = {
          Id: params["id"],
          code: this.product.code,
          name: this.product.name,
          detail: "No detaill",
          unit: this.product.unit,
          categoryId: this.selectCatogeryId,
          price: this.product.price,
          user: JSON.parse(localStorage.getItem("user")).name,
        };


        this.apiService.updateProduct(updatedProduct).subscribe(data => {
          console.log("Product List Data:", data)
          if (data.status == 500) {
            errorDialog("Operation Failed", data.message);
          }
          else if (data != null && data != undefined) {
            try {
              //   this.product.name = data.product.name;
              // this.product._categoryId = data.product._categoryId;
              // this.product.price = data.product.price;
              // this.product.unit = data.product.unit;
           
              this.router.navigate(["/products"]);
            }
            catch
            {
            }
          }
          else {
          
            // this.isLoading = false;
          }
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
      });
    }
    else {
      errorDialog("Validation", "Fields are empty");
    }
  }

  fetchAllCategory() {

    try {
      this.apiService.getCategoryList().subscribe((response) => {
        console.log("response::", response);
        response.categoryList.forEach((element: any) => {
          this.categories.push({
            category: element.name, id: element._id
          });
        });
      });
    } catch (error) {
      console.error(error);
    }

  };

  selectedOption(event: any) {
    this.selectCatogeryId = event.target.value;
    console.log(this.selectCatogeryId);
  }
}
function errorDialog(title: any, msg: any) {
  $.confirm({
    title: title,
    content: msg,
    type: "red",
    typeAnimated: true,
    buttons: {
      close: function () {},
    },
  });
}