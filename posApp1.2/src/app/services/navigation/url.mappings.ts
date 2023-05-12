import { environment } from "../../../environments/environment";

export class UrlMappings {
  // user: any = JSON.parse(localStorage.getItem("user"));
  // dbName = this.user.dbName;

  public static BASE_HREF = `/smartdashboard`;


  public static LOGIN = `${environment.posApi}/users/login`;
  public static SIGNUP = `${environment.posApi}/users/signup`;

  public static Feedback = `${environment.posApi}/users/feedback`;

  public static Login = `${environment.bigoPOS_API}/users/login`;
  public static Signup = `${environment.bigoPOS_API}/users/signup`;
  public static checkEmail = `${environment.bigoPOS_API}/users/checkEmail`;
  public static checkDbName = `${environment.bigoPOS_API}/users/checkDbName`;
  public static Logout = `${environment.bigoPOS_API}/users/logout`;
  public static Confirmation = `${environment.bigoPOS_API}/users/confirmation`;
  public static ForgetPassword = `${environment.bigoPOS_API}/users/forgetPassword`;
  public static UpdatePassword = `${environment.bigoPOS_API}/users/updatePassword`;

  public static AddProduct = `${
    environment.bigoPOS_API
  }/products/add`;
  public static ProductList = `${
    environment.bigoPOS_API
  }/products/list`;
  public static UpdateProduct = `${
    environment.bigoPOS_API
  }/products/update`;
  public static UpdateProductInventory = `${
    environment.bigoPOS_API
  }/products/updateInventory`;
  public static DeleteProduct = `${
    environment.bigoPOS_API
  }/products/delete`;
  public static GetProductById = `${
    environment.bigoPOS_API
  }/products/view`;
  public static GetProductByCategory = `${
    environment.bigoPOS_API
  }/products/productByCategory`;
  public static TopProducts = `${
    environment.bigoPOS_API
  }/products/topProducts`;

  public static AddSale = `${
    environment.bigoPOS_API
  }/sales/add`;
  public static SalesList = `${
    environment.bigoPOS_API
  }/sales/list`;
  public static UpdateSales = `${
    environment.bigoPOS_API
  }/sales/update`;
  public static DeleteSales = `${
    environment.bigoPOS_API
  }/sales/delete`;
  public static GetSalesById = `${
    environment.bigoPOS_API
  }/sales/view`;
  public static YearlySales = `${environment.bigoPOS_API}/sales/yearlySales`;
  public static MonthlySales = `${environment.bigoPOS_API}/sales/monthlySales`;
  public static WeaklySales = `${environment.bigoPOS_API}/sales/weaklySales`;
  public static SalesByFilter = `${environment.bigoPOS_API}/sales/salesByFilter`;
  public static SalesByProduct = `${
    environment.bigoPOS_API
  }/sales/salesByProduct`;

  public static AddCategory = `${
    environment.bigoPOS_API
  }/categories/add`;
  public static CategoryList = `${
    environment.bigoPOS_API
  }/categories/list`;
  public static UpdateCategory = `${
    environment.bigoPOS_API
  }/categories/update`;
  public static DeleteCategory = `${
    environment.bigoPOS_API
  }/categories/delete`;
  public static GetCategoryById = `${
    environment.bigoPOS_API
  }/categories/view`;

  public static AddReceivings = `${
    environment.bigoPOS_API
  }/receivings/add`;
  public static ReceivingsList = `${
    environment.bigoPOS_API
  }/receivings/list`;
  public static UpdateReceivings = `${
    environment.bigoPOS_API
  }/receivings/update`;
  public static DeleteReceivings = `${
    environment.bigoPOS_API
  }/receivings/delete`;
  public static GetReceivingById = `${
    environment.bigoPOS_API
  }/receivings/view`;
  public static YearlyReceiving = `${environment.bigoPOS_API}/receivings/yearlyReceiving`;
  public static MonthlyReceiving = `${environment.bigoPOS_API}/receivings/monthlyReceiving`;
  public static WeaklyReceiving = `${environment.bigoPOS_API}/receivings/weaklyReceiving`;
  public static ReceivingByFilter = `${environment.bigoPOS_API}/receivings/receivingByFilter`;
  public static ReceivingByProduct = `${
    environment.bigoPOS_API
  }/receivings/receivingByProduct`;

  public static AddExpenses = `${
    environment.bigoPOS_API
  }/expenses/add`;
  public static ExpensesList = `${
    environment.bigoPOS_API
  }/expenses/list`;
  public static UpdateExpenses = `${
    environment.bigoPOS_API
  }/expenses/update`;
  public static DeleteExpenses = `${
    environment.bigoPOS_API
  }/expenses/delete`;
  public static GetExpensesById = `${
    environment.bigoPOS_API
  }/expenses/view`;
  public static YearlyExpenses = `${environment.bigoPOS_API}/expenses/yearlyExpense`;
  public static MonthlyExpenses = `${environment.bigoPOS_API}/expenses/monthlyExpense`;
  public static WeaklyExpenses = `${environment.bigoPOS_API}/expenses/weaklyExpense`;
  public static ExpenseByFilter = `${environment.bigoPOS_API}/expenses/expenseByFilter`;

  public static YearlyAnalysis = `${environment.bigoPOS_API}/analysis/yearlyAnalysis`;
  public static MonthlyAnalysis = `${environment.bigoPOS_API}/analysis/monthlyAnalysis`;
  public static WeeklyAnalysis = `${environment.bigoPOS_API}/analysis/weaklyAnalysis`;
  public static AllAnalysis = `${environment.bigoPOS_API}/analysis/allAnalysis`;

  public static TotalSales = `${
    environment.bigoPOS_API
  }/analysis/totalSales`;
  public static TotalReceivings = `${
    environment.bigoPOS_API
  }/analysis/totalReceivings`;
  public static TotalExpenses = `${
    environment.bigoPOS_API
  }/analysis/totalExpenses`;

  public static allUsers = `${environment.bigoPOS_API}/users/list`;
  public static addUser = `${environment.bigoPOS_API}/users/add`;
  public static updateUser = `${environment.bigoPOS_API}/users/update`;
  public static userById = `${environment.bigoPOS_API}/users/view`;
  //public static deleteUser = `${environment.bigoPOS_API}/users/add`;
}
