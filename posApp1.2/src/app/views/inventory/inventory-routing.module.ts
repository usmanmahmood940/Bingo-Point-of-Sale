import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditInentoryComponent } from './edit-inentory/edit-inentory.component';
import { InventoryComponent } from './inventory.component';

const routes: Routes = [
  { path: "", component: InventoryComponent },
  {
    path: "edit/:id",
    component: EditInentoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
