var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
var SaleModels = require("./users").SaleModels;
var ExpenseModels = require("./users").ExpenseModels;
var ReceivingModels = require("./users").ReceivingModels;
// var Category = require("../models/category.model");
// var Sales = require("../models/sales.model");
// var Receiving = require("../models/receiving.model");

 

// Get all Sales

router.get("/allAnalysis/:year/:month", async function (req, res, next) {
var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    let input, input2;
    input = req.params.year;
    input2 = req.params.month;

    let year = Number.parseInt(input, 10);
    let month = Number.parseInt(input2, 10);
    let sales = {
      yearly: [],
      monthly: [],
      weekly: [],
    };
    let receivings = {
      yearly: [],
      monthly: [],
      weekly: [],
    };
    let expenses = {
      yearly: [],
      monthly: [],
      weekly: [],
    };
    let sumOfSales;
    let sumOfReceivings
    let sumOfExpenses;
    let y = year;
    for (let i = 1; i < 6; i++) {
      sumOfSales = await getTotalSalesSumOfYear(y,Sales);
      sales.yearly.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfYear(y,Receiving);
      receivings.yearly.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfYear(y,Expense);
      expenses.yearly.push(sumOfExpenses);
      y = y - 1;
    }
    for (let i = 1; i < 13; i++) {
      sumOfSales = await getTotalSalesSumOfMonth(year, i, Sales);
      sales.monthly.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfMonth(year, i, Receiving);
      receivings.monthly.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfMonth(year, i, Expense);
      expenses.monthly.push(sumOfExpenses);
    }
    let startRange = 1;
    for (let i = 1; i < 5; i++) {
      sumOfSales = await getTotalSalesSumOfWeek(year, month, startRange, Sales);
      sales.weekly.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfWeek(
        year,
        month,
        startRange,
        Receiving
      );
      receivings.weekly.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfWeek(
        year,
        month,
        startRange,
        Expense
      );
      expenses.weekly.push(sumOfExpenses);

      startRange = startRange + 7;
    }
    res.send({
      status: 200,
      salesArray: sales,
      receivingsArray: receivings,
      expensesArray: expenses,
    });
  }
});

router.get("/yearlyAnalysis/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let sales = [];
    let receivings = [];
    let expenses = [];
    let sumOfSales;
    let sumOfReceivings;
    let sumOfExpenses;
    for (let i = 1; i < 6; i++) {
      sumOfSales = await getTotalSalesSumOfYear(year,Sales);
      sales.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfYear(year,Receiving);
      receivings.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfYear(year,Expense);
      expenses.push(sumOfExpenses);
      year = year - 1;
    }
    res.send({
      status: 200,
      salesArray: sales,
      receivingsArray: receivings,
      expensesArray: expenses,
    });
  }
});

async function getTotalSalesSumOfYear(year,Sales) {
  const response = await Sales.aggregate([
    { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
    { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }

  return response.at(0).sumAmount;
}


async function getTotalReceivingSumOfYear(year,Receiving) {
  const response = await Receiving.aggregate([
    { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
    { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }

  return response.at(0).sumAmount;
}


async function getTotalExpenseSumOfYear(year,Expense) {
  const response = await Expense.aggregate([
    { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
    { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }

  return response.at(0).sumAmount;
}


router.get("/monthlyAnalysis/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let sales = [];
    let receivings = [];
    let expenses = [];
    let sumOfSales;
    let sumOfReceivings;
    let sumOfExpenses;
    for (let i = 1; i < 13; i++) {
      sumOfSales = await getTotalSalesSumOfMonth(year, i,Sales);
      sales.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfMonth(year, i,Receiving);
      receivings.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfMonth(year, i,Expense);
      expenses.push(sumOfExpenses);
    }
    res.send({
      status: 200,
      salesArray: sales,
      receivingsArray: receivings,
      expensesArray: expenses,
    });
  }
});

async function getTotalSalesSumOfMonth(year, month,Sales) {
  const response = await Sales.aggregate([
    {
      $match: {
        $and: [
          { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
          { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
        ],
      },
    },
    { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}

async function getTotalReceivingSumOfMonth(year, month,Receiving) {
  const response = await Receiving.aggregate([
    {
      $match: {
        $and: [
          { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
          { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
        ],
      },
    },
    { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}


async function getTotalExpenseSumOfMonth(year, month,Expense) {
  const response = await Expense.aggregate([
    {
      $match: {
        $and: [
          { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
          { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
        ],
      },
    },
    { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}


router.get("/weaklyAnalysis/:year/:month", async function (req, res, next) {

  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    let input, input2;
    input = req.params.year;
    input2 = req.params.month;
    let year = Number.parseInt(input, 10);
    let month = Number.parseInt(input2, 10);
    let sales = [];
    let receivings = [];
    let expenses = [];
    let sumOfSales;
    let sumOfReceivings;
    let sumOfExpenses;

    let startRange = 1;
    for (let i = 1; i < 5; i++) {
      sumOfSales = await getTotalSalesSumOfWeek(year, month, startRange,Sales);
      sales.push(sumOfSales);
      sumOfReceivings = await getTotalReceivingSumOfWeek(year, month, startRange,Receiving);
      receivings.push(sumOfReceivings);
      sumOfExpenses = await getTotalExpenseSumOfWeek(year, month, startRange,Expense);
      expenses.push(sumOfExpenses);

      startRange = startRange + 7;
    }
    res.send({
      status: 200,
      salesArray: sales,
      receivingsArray: receivings,
      expensesArray: expenses,
    });
  }
});

async function getTotalSalesSumOfWeek(year, month, startRange,Sales) {
  let response;
  if (startRange == 22) {
    response = await Sales.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
    ]);
  } else {
    let endRange = startRange + 6;
    response = await Sales.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
            { $expr: { $lte: [{ $dayOfMonth: "$createdAt" }, endRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
    ]);
  }
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}


async function getTotalReceivingSumOfWeek(year, month, startRange,Receiving) {
  let response;
  if (startRange == 22) {
    response = await Receiving.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
    ]);
  } else {
    let endRange = startRange + 6;
    response = await Receiving.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
            { $expr: { $lte: [{ $dayOfMonth: "$createdAt" }, endRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
    ]);
  }
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}


async function getTotalExpenseSumOfWeek(year, month, startRange,Expense) {
  let response;
  if (startRange == 22) {
    response = await Expense.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
    ]);
  } else {
    let endRange = startRange + 6;
    response = await Expense.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: [{ $year: "$createdAt" }, year] } },
            { $expr: { $eq: [{ $month: "$createdAt" }, month] } },
            { $expr: { $gte: [{ $dayOfMonth: "$createdAt" }, startRange] } },
            { $expr: { $lte: [{ $dayOfMonth: "$createdAt" }, endRange] } },
          ],
        },
      },
      { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
    ]);
  }
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}




router.get("/totalSales", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    Sales.aggregate(
      [{ $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } }],
      function (err, sumAmount) {
        if (err) {
          console.log(err);
        } else {
          if (sumAmount[0] === undefined) {
            res.send({
              status: 200,
              total: 0,
            });
          } else {
            console.log("Total Sales sum:" + sumAmount);
            res.send({
              status: 200,
              total: sumAmount[0].sumAmount,
            });
          }
        }
      }
    );
  }
});

router.get("/totalReceivings", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    Receiving.aggregate(
      [{ $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } }],
      function (err, sumAmount) {
        if (err) {
          console.log(err);
        } else {
          if (sumAmount[0] === undefined) {
            res.send({
              status: 200,
              total: 0,
            });
          } else {
            console.log("Total Receiving sum:" + sumAmount);
            res.send({
              status: 200,
              total: sumAmount[0].sumAmount,
            });
          }
        }
      }
    );
  }
});

router.get("/totalExpenses", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Sales = SaleModels[dbName];
    const Expense = ExpenseModels[dbName];
    const Receiving = ReceivingModels[dbName];
    Expense.aggregate(
      [{ $group: { _id: null, sumAmount: { $sum: "$amount" } } }],
      function (err, sumAmount) {
        if (err) {
        
          console.log(err);
        } else {
          if (sumAmount[0] === undefined) {
            res.send({
              status: 200,
              total: 0,
            });
          } else {
            console.log("Total Expenses sum:" + sumAmount);
            res.send({
              status: 200,
              total: sumAmount[0].sumAmount,
            });
          }
        }
      }
    );
  }
});
module.exports = router;
