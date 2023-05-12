import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiService } from "./services/navigation/api.service";
import { PaginationModule } from "@coreui/angular";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";

// Import routing module
import { AppRoutingModule } from "./app-routing.module";

// Import app component
import { AppComponent } from "./app.component";

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from "./containers";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  ModalModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
  SpinnerModule,
  FormModule,
  AlertModule,
  TableModule,
} from "@coreui/angular";
import { IconModule, IconSetService } from "@coreui/icons-angular";
import { AuthTokenInterceptor } from "./services/interceptor/auth-token.interceptor";
import { NgChartsModule } from "ng2-charts";
import { ReportsComponent } from "./reports/reports.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { AuthGuardGuard } from "./services/AuthGuard/auth-guard.guard";
import { AdminGuard } from "./services/AdminGuard/admin.guard";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ReportsComponent,
    ChangePasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    ModalModule,
    HttpClientModule,
    NgChartsModule,
    PaginationModule,
    SpinnerModule,
    FormModule,
    AlertModule,
    TableModule,
  ],
  providers: [
    ApiService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: [PERFECT_SCROLLBAR_CONFIG],
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    IconSetService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
