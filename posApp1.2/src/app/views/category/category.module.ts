import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";

import {
AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule
} from "@coreui/angular";

import { IconModule } from "@coreui/icons-angular";


import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryComponent } from "./category.component";
import { EditCategoryComponent } from "./edit-category/edit-category.component";
import { AddComponent } from './add/add.component';
import { InventoryModule } from "../inventory/inventory.module";
@NgModule({
  declarations: [CategoryComponent, EditCategoryComponent, AddComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    UtilitiesModule,
    SharedModule,
    ListGroupModule,
    IconModule,
    ListGroupModule,
    PlaceholderModule,
    ProgressModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    NgxPaginationModule,
    FormsModule,
    InventoryModule,
  ],
})
export class CategoryModule {}
