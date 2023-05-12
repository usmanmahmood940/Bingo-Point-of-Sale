import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";

// CoreUI Modules
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
  UtilitiesModule,
} from "@coreui/angular";

import { IconModule } from "@coreui/icons-angular";

import { InventoryRoutingModule } from "./inventory-routing.module";
import { InventoryComponent } from "./inventory.component";
import { EditInentoryComponent } from "./edit-inentory/edit-inentory.component";
import{SortByPipe} from "./sort-by.pipe"


@NgModule({
  declarations: [InventoryComponent, EditInentoryComponent, SortByPipe],
  imports: [
    CommonModule,
    InventoryRoutingModule,
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
  ],
  exports: [SortByPipe],
})
export class InventoryModule {}
