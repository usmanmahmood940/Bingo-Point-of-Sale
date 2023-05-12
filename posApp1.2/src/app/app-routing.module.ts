import { AuthGuardGuard } from "./services/AuthGuard/auth-guard.guard";
import { AdminGuard } from "./services/AdminGuard/admin.guard";
import { MasterAdminGuard } from "./services/master-admin.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DefaultLayoutComponent } from "./containers";
import { LoginComponent } from "./views/pages/login/login.component";

import { ReportsComponent } from "./reports/reports.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { RegisterComponent } from "./views/pages/register/register.component";
import { Page404Component } from "./views/pages/page404/page404.component";
import { ConfirmationComponent } from "./views/pages/confirmation/confirmation.component";
import { ForgetPasswordComponent } from "./views/pages/forget-password/forget-password.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    canActivate: [AuthGuardGuard],
    data: {
      title: "Home",
    },

    children: [
      {
        path: "dashboard",
        //  canActivate:[AuthGuardGuard],
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        canActivate: [MasterAdminGuard],
      },
      // {
      //   path: 'theme',
      //   loadChildren: () =>
      //     import('./views/theme/theme.module').then((m) => m.ThemeModule)
      // },
      // {
      //   path: 'base',
      //   loadChildren: () =>
      //     import('./views/base/base.module').then((m) => m.BaseModule)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () =>
      //     import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () =>
      //     import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      // },
      // {

      //   path: "changePassword",
      //   //canActivate:[AuthGuardGuard],
      //   component: ChangePasswordComponent,
      //   data: {
      //     title: "ChangePassword",
      //   },
      // },

      // {
      //   path: 'icons',
      //   loadChildren: () =>
      //     import('./views/icons/icons.module').then((m) => m.IconsModule)
      // },
      // {
      //   path: 'settings',
      //   loadChildren: () =>
      //     import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      // },
      // {
      //   path: "widgets",
      //   loadChildren: () =>
      //     import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
      // },
      {
        path: "pages",
        loadChildren: () =>
          import("./views/pages/pages.module").then((m) => m.PagesModule),
        canLoad: [false],
      },
      // {
      //   path: "icons",
      //   loadChildren: () =>
      //     import("./views/icons/icons.module").then((m) => m.IconsModule),
      // },
      {
        path: "products",
        loadChildren: () =>
          import("./views/products/products.module").then(
            (m) => m.ProductsModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: "sales",
        loadChildren: () =>
          import("./views/invoice/invoice.module").then((m) => m.InvoiceModule),
      },
      // {
      //   path: "charts",
      //   loadChildren: () =>
      //     import("./views/charts/charts.module").then((m) => m.ChartsModule),
      // },
      {
        path: "category",
        loadChildren: () =>
          import("./views/category/category.module").then(
            (m) => m.CategoryModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: "inventory",
        loadChildren: () =>
          import("./views/inventory/inventory.module").then(
            (m) => m.InventoryModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: "receiving",
        loadChildren: () =>
          import("./views/receiving/receiving.module").then(
            (m) => m.ReceivingModule
          ),
        canActivate: [AdminGuard],
      },

      {
        path: "expenses",
        loadChildren: () =>
          import("./views/expenses/expenses.module").then(
            (m) => m.ExpensesModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: "users",
        loadChildren: () =>
          import("./views/users/users.module").then((m) => m.UsersModule),
        canActivate: [MasterAdminGuard],
      },
      {
        path: "help",
        loadChildren: () =>
          import("./views/help-support/help-support.module").then(
            (m) => m.HelpSupportModule
          ),
        canActivate: [AdminGuard],
      },
    ],
  },
  // {
  //   path: '404',
  //   component: Page404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   component: Page500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login",
    },
  },

  {
    path: "signup",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  {
    path: "confirmation/:id",
    component: ConfirmationComponent,
    data: {
      title: "Confirmation Page",
    },
  },
  {
    path: "forgetPassword",
    component: ForgetPasswordComponent,
    data: {
      title: "Forget Password",
    },
  },
  {
    path: "changePassword/:id",
    component: ChangePasswordComponent,
    data: {
      title: "ChangePassword",
    },
  },

  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top",
      anchorScrolling: "enabled",
      initialNavigation: "enabledBlocking",
      // relativeLinkResolution: 'legacy'
    }),
  ],
 
  exports: [RouterModule],
   providers :[ AuthGuardGuard,
    AdminGuard]
  
})
export class AppRoutingModule {}
