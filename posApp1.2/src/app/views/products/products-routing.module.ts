import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ProductsComponent } from './products.component';
import { ViewEditComponent } from './view-edit/view-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    data: {
      title: $localize`Product`
    },
  },
  // {
  //   path: 'edit',
  //   component: ViewEditComponent,
  // },
  {
    path: 'edit/:id',
    component: ViewEditComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
