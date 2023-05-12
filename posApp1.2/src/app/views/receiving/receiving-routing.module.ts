import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivingComponent } from './receiving.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
const routes: Routes = [
  { path: "", component: ReceivingComponent },
  {
    path: "edit/:id",
    component: EditComponent,
  },
  {
    path: "add",
    component: AddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivingRoutingModule { }
