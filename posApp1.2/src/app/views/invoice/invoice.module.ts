import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";


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


//angular material

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxPaginationModule } from "ngx-pagination";

import { IconModule } from "@coreui/icons-angular";

//Views
// import { AddItemsComponent } from './add-items/add-items.component';
// import { ViewItemsComponent } from './view-items/view-items.component';
import { InvoiceComponent } from "./invoice.component";
import { InventoryModule } from "../inventory/inventory.module";
// Components Routing
import { InvoiceRoutingModule } from "./invoice-routing.module";
import { AddComponent } from './add/add.component';
import { CreateInvoiceTableComponent } from './create-invoice-table/create-invoice-table.component';
import  {InvoiceFormatComponent} from './invoice-format/invoice-format.component'

import { NgxBarcodeModule } from 'ngx-barcode';
import { EditComponent } from './edit/edit.component';

// import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  declarations: [
    InvoiceComponent,
    AddComponent,
    CreateInvoiceTableComponent,
    InvoiceFormatComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
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
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxBarcodeModule,
    InventoryModule,
    NgxPaginationModule,
    // QrCodeModule
  ],
})
export class InvoiceModule {}
