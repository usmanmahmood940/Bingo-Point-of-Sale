import { UrlMappings } from "./url.mappings";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  mergeMap,
  toArray,
} from "rxjs/operators";

declare var $:any
@Injectable({
  providedIn: "root",
})
export class ApiService {
  user: any;
  dbName: any;
  constructor(private http: HttpClient) {
    if (JSON.parse(localStorage.getItem("user"))) {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.dbName = this.user.dbName;
    } else {
      this.dbName = "undefined";
    }
  }
  setDbName(dbName: any) {
    this.dbName = dbName;
  }

  /*POS SERVICES*/
  authenticateUser(authenticate: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
    };

    return this.http.post(UrlMappings.LOGIN, authenticate).pipe(
      map((response) => {
        return response;
      })
    );
  }

  signUp(authenticate: any): Observable<any> {
    return this.http.post(UrlMappings.SIGNUP, authenticate).pipe(
      map((response) => {
        return response;
      })
    );
  }

  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ",";
    const keys = Object.keys(rows[0]);

    const csvData =
      keys.join(separator) +
      "\n" +
      rows
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              // cell = cell instanceof Date
              //   ? cell.toLocaleString()
              //   : cell.toString().replace(/"/g, '""');
              // if (cell.search(/("|,|\n)/g) >= 0) {
              //   cell = `"${cell}"`;
              // }
              return '"' + cell + '"';
            })
            .join(separator);
        })
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    // if (navigator.msSaveBlob) { // IE 10+
    //   navigator.msSaveBlob(blob, filename);
    // } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // }
  }
  // logout(): Observable<any> {
  //   return this.http.get<any>(UrlMappings.CM_LOGOUT_URL);
  // }

  // Serivices by usman

  // Authentication Services
  signup(user: any) {
    let url = UrlMappings.Signup;
    return this.http.post(url, user);
  }

  login(user: any) {
    let url = UrlMappings.Login;
    return this.http.post(url, user);
  }
  logout(): Observable<any> {
    let url = UrlMappings.Logout + "?dbName=" + this.dbName;
    return this.http.get(url);
  }
  checkEmail(email: any): Observable<any> {
    let url = UrlMappings.checkEmail + "?email=" + email;
    return this.http.get(url);
  }
  checkDbName(dbName: any): Observable<any> {
    let url = UrlMappings.checkDbName + "?dbName=" + dbName;
    return this.http.get(url);
  }
  confirmation(userId: any): Observable<any> {
    let url = UrlMappings.Confirmation;
    return this.http.post(url, userId);
  }
  forgetPassword(email: any): Observable<any> {
    let url = UrlMappings.ForgetPassword;
    return this.http.post(url, email);
  }
  updatePassword(user: any): Observable<any> {
    let url = UrlMappings.UpdatePassword;
    return this.http.put(url, user);
  }

  // Product Services

  addProduct(product: any): Observable<any> {
    let url = UrlMappings.AddProduct + "?dbName=" + this.dbName + "&";
    return this.http.post(url, product);
  }

  updateProduct(product: any): Observable<any> {
    let url = UrlMappings.UpdateProduct + "?dbName=" + this.dbName + "&";
    return this.http.put(url, product);
  }
  updateProductInventory(productInventory: any): Observable<any> {
    let url =
      UrlMappings.UpdateProductInventory + "?dbName=" + this.dbName + "&";
    return this.http.put(url, productInventory);
  }

  getProductList(): Observable<any> {
    let url = UrlMappings.ProductList + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  getProductByID(productId: any): Observable<any> {
    let url = UrlMappings.GetProductById + "?dbName=" + this.dbName + "&" +"productId=" + productId;
    return this.http.get(url);
  }

  deleteProduct(productId: any): Observable<any> {
    let url =
      UrlMappings.DeleteProduct +
      "?dbName=" +
      this.dbName +
      "&" +
      "productId=" +
      productId;
    return this.http.delete(url);
  }

  topProducts(): Observable<any> {
    let url = UrlMappings.TopProducts + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  // Sales Services

  addSale(sale: any): Observable<any> {
    let url = UrlMappings.AddSale + "?dbName=" + this.dbName + "&";
    return this.http.post(url, sale);
  }

  updateSales(sale: any) {
    let url = UrlMappings.UpdateSales + "?dbName=" + this.dbName + "&";
    return this.http.put(url, sale);
  }

  getSalesList(): Observable<any> {
    let url = UrlMappings.SalesList + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  getSalesById(saleId: any): Observable<any> {
    let url =
      UrlMappings.GetSalesById +
      "?dbName=" +
      this.dbName +
      "&" +
      "saleId=" +
      saleId;
    return this.http.get(url);
  }
  getSaleByProduct(productId: any): Observable<any> {
    let url =
      UrlMappings.SalesByProduct +
      "?dbName=" +
      this.dbName +
      "&" +
      "productId=" +
      productId;
    return this.http.get(url);
  }

  deleteSale(saleId: any): Observable<any> {
    let url =
      UrlMappings.DeleteSales +
      "?dbName=" +
      this.dbName +
      "&" +
      "saleId=" +
      saleId;
    return this.http.delete(url);
  }

  getYearlySales(): Observable<any> {
    let year = new Date().getFullYear();
    let url = UrlMappings.YearlySales + "/" + year + "?dbName=" + this.dbName;
    return this.http.get(url);
  }
  getMonthlySales(year: Number): Observable<any> {
    let url = UrlMappings.MonthlySales + "/" + year + "?dbName=" + this.dbName;
    return this.http.get(url);
  }
  getWeaklySales(year: Number, month: Number): Observable<any> {
    let url =
      UrlMappings.WeaklySales +
      "/" +
      year +
      "/" +
      month +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  getSalesByFilter(startDate, endDate): Observable<any> {
    let url =
      UrlMappings.SalesByFilter +
      "/" +
      startDate +
      "/" +
      endDate +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  // Category Services

  addCategory(category: any): Observable<any> {
    let url = UrlMappings.AddCategory + "?dbName=" + this.dbName + "&";
    return this.http.post(url, category);
  }

  updateCategory(category: any): Observable<any> {
    let url = UrlMappings.UpdateCategory + "?dbName=" + this.dbName + "&";
    return this.http.put(url, category);
  }

  getCategoryList(): Observable<any> {
    let url = UrlMappings.CategoryList + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  getCategoryById(categoryId: any): Observable<any> {
    let url =
      UrlMappings.GetCategoryById +
      "?dbName=" +
      this.dbName +
      "&" +
      "categoryId=" +
      categoryId;
    return this.http.get(url);
  }

  deleteCategory(categoryId: any): Observable<any> {
    let url =
      UrlMappings.DeleteCategory +
      "?dbName=" +
      this.dbName +
      "&" +
      "categoryId=" +
      categoryId;
    return this.http.delete(url);
  }

  getProductByCategory(categoryId: any): Observable<any> {
    let url =
      UrlMappings.GetProductByCategory +
      "?dbName=" +
      this.dbName +
      "&" +
      "categoryId=" +
      categoryId;
    return this.http.get(url);
  }

  // Receiving Services

  addReceiving(receiving: any): Observable<any> {
    let url = UrlMappings.AddReceivings + "?dbName=" + this.dbName + "&";
    return this.http.post(url, receiving);
  }

  updateReceiving(receiving: any): Observable<any> {
    let url = UrlMappings.UpdateReceivings + "?dbName=" + this.dbName + "&";
    return this.http.put(url, receiving);
  }

  getReceivingList(): Observable<any> {
    let url = UrlMappings.ReceivingsList + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  getReceivingById(receivingId: any): Observable<any> {
    let url =
      UrlMappings.GetReceivingById +
      "?dbName=" +
      this.dbName +
      "&" +
      "receivingId=" +
      receivingId;
    return this.http.get(url);
  }

  deleteReceiving(receivingId: any): Observable<any> {
    let url =
      UrlMappings.DeleteReceivings +
      "?dbName=" +
      this.dbName +
      "&" +
      "receivingId=" +
      receivingId;
    return this.http.delete(url);
  }
  getReceivingByProduct(productId: any): Observable<any> {
    let url =
      UrlMappings.ReceivingByProduct +
      "?dbName=" +
      this.dbName +
      "&" +
      "productId=" +
      productId;
    return this.http.get(url);
  }

  getReceivingByFilter(startDate, endDate): Observable<any> {
    let url =
      UrlMappings.ReceivingByFilter +
      "/" +
      startDate +
      "/" +
      endDate +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  // Expenses Services

  addExpenses(expense: any): Observable<any> {
    let url = UrlMappings.AddExpenses + "?dbName=" + this.dbName + "&";
    return this.http.post(url, expense);
  }

  updateExpenses(expense: any): Observable<any> {
    let url = UrlMappings.UpdateExpenses + "?dbName=" + this.dbName + "&";
    return this.http.put(url, expense);
  }

  getExpensesList(): Observable<any> {
    let url = UrlMappings.ExpensesList + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  getExpensesById(expenseId: any): Observable<any> {
    let url =
      UrlMappings.GetExpensesById +
      "?dbName=" +
      this.dbName +
      "&" +
      "expenseId=" +
      expenseId;
    return this.http.get(url);
  }

  deleteExpenses(expenseId: any): Observable<any> {
    let url =
      UrlMappings.DeleteExpenses +
      "?dbName=" +
      this.dbName +
      "&" +
      "expenseId=" +
      expenseId;
    return this.http.delete(url);
  }

  getExpenseByFilter(startDate, endDate): Observable<any> {
    let url =
      UrlMappings.ExpenseByFilter +
      "/" +
      startDate +
      "/" +
      endDate +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  // Helper Functions :
  // Date format functions

  getDateFormat(date: Date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const validDate = new Date(date);
    const day = validDate.getDate();

    const monthIndex = validDate.getMonth();
    const monthName = monthNames[monthIndex];

    const year = validDate.getFullYear();
    let dateInFormat = day + "-" + monthName + "-" + year;
    return dateInFormat;
  }

  getTime(d: Date) {
    var hours: any;

    const date = new Date(d);
    hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    return time;
  }
  // Sort Function
  sortTable(n: any) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = <HTMLSelectElement>document.getElementById("myTable");
    console.log(table);
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
  no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;

      /*Loop through all table rows (except the
    first, which contains table headers):*/
      for (i = 2; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;

        /*Get the two elements you want to compare,
      one from current row and one from the next:*/
        console.log(rows[2]);
        x = <HTMLSelectElement>rows[i].getElementsByTagName("TD")[n];
        y = <HTMLSelectElement>rows[i + 1].getElementsByTagName("TD")[n];
        console.log(x);
        /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
        let x1 = Number(x.innerHTML);
        let x2 = Number(y.innerHTML);
        console.log(x1);
        console.log(x2);
        if (dir == "asc") {
          if (isNaN(x1)) {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          } else {
            if (x1 > x2) {
              shouldSwitch = true;
              break;
            }
          }
        } else if (dir == "desc") {
          if (isNaN(x1)) {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          } else {
            if (x1 < x2) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  getYearlyAnalysis() {
    let year = new Date().getFullYear();
    let url =
      UrlMappings.YearlyAnalysis + "/" + year + "?dbName=" + this.dbName;
    return this.http.get(url);
  }

  getMonthlyAnalysis(year: Number): Observable<any> {
    let url =
      UrlMappings.MonthlyAnalysis + "/" + year + "?dbName=" + this.dbName;
    return this.http.get(url);
  }
  getWeaklyAnalysis(year: Number, month: Number): Observable<any> {
    let url =
      UrlMappings.WeeklyAnalysis +
      "/" +
      year +
      "/" +
      month +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  getAllAnalysis(year: Number, month: Number): Observable<any> {
    let url =
      UrlMappings.AllAnalysis +
      "/" +
      year +
      "/" +
      month +
      "?dbName=" +
      this.dbName;
    return this.http.get(url);
  }

  getTotalSales(): Observable<any> {
    let url = UrlMappings.TotalSales + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }
  getTotalReceivings(): Observable<any> {
    let url = UrlMappings.TotalReceivings + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }
  getTotalExpenses(): Observable<any> {
    let url = UrlMappings.TotalExpenses + "?dbName=" + this.dbName + "&";
    return this.http.get(url);
  }

  errorDialog(title: any, msg: any) {
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

  // Users APi's
  getUsersList(dbName: any): Observable<any> {
    let url = UrlMappings.allUsers + "?dbName=" + dbName;
    return this.http.get(url);
  }

  editUser(user: any): Observable<any> {
    let url = UrlMappings.updateUser;
    return this.http.post(url, user);
  }

  addUser(user: any): Observable<any> {
    let url = UrlMappings.addUser;
    return this.http.post(url, user);
  }
  getUserByID(userId: any): Observable<any> {
    let url = UrlMappings.userById + "?userId=" + userId;
    return this.http.get(url);
  }
  updateUser(user: any): Observable<any> {
    let url = UrlMappings.updateUser;
    return this.http.put(url, user);
  }

  sendFeedback(feedback: any): Observable<any> {
    let url = UrlMappings.Feedback;
    return this.http.post(url, feedback);
  }
}

