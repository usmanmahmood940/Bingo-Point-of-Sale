// const { count } = require("console");
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
var ExpenseModels = require("./users").ExpenseModels;


// var Category = require("../models/category.model");
// var Sales = require("../models/sales.model");
// var Receiving = require("../models/receiving.model");

// Get all Expenses
router.get("/list", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    Expense.find(function (err, expenseListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Expense",
        });
      } else {
        let count = expenseListResponse.length;
        res.send({
          status: 200,
          totalExpenses: count,
          expenseList: expenseListResponse,
        });
      }
    });
  }
});

// Add Exxoenses
router.post("/add", function (req, res, next) {

  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    let expenseObj = new Expense({
      name: req.body.name,
      detail: req.body.detail,
      amount: req.body.amount,
      createdBy: req.body.user,
      updatedBy: req.body.user,
      updatedAt: Date.now(),
    });

    expenseObj.save(function (err, addedExpense) {
      if (err) {
        res.send({ error: err, status: 500, message: "Unable to add expense" });
      } else {
        res.send({
          status: 200,
          message: "Expense Added Successfully",
          expense: addedExpense,
        });
      }
    });
  }
});

// Update Expense
router.put("/update", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    var expenseId = req.body.expenseId;
    const expenseObj = {
      name: req.body.name,
      detail: req.body.detail,
      amount: req.body.amount,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };

    Expense.findByIdAndUpdate(
      expenseId,
      expenseObj,
      {
        returnOriginal: false,
      },
      function (err, updatedExpense) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to Update Expense",
          });
        } else {
          res.send({
            status: 200,
            message: "Expense Updated Successfully",
            expense: updatedExpense,
          });
        }
      }
    );
  }
});

// Delete Expense
router.delete("/delete", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    var expenseId = req.query.expenseId;

    Expense.findOneAndRemove({ _id: expenseId }, function (err) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to delete Expense",
        });
      } else {
        res.send({
          status: 200,
          message: "Expense Deleted Successfully",
        });
      }
    });
  }
});

// Get Specific Expense
router.get("/view", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    const expenseId = req.query.expenseId;
    Expense.findById(expenseId, function (err, expenseResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Expense",
        });
      } else {
        res.send({
          status: 200,
          expense: expenseResponse,
        });
      }
    });
  }
});

router.get("/yearlyExpense/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let totalSum = [];
    let sum;
    for (let i = 1; i < 6; i++) {
      sum = await getTotalSumOfYear(year,Expense);
      totalSum.push(sum);
      year = year - 1;
    }
    res.send(totalSum);
  }
});

async function getTotalSumOfYear(year,Expense) {
  const response = await Expense.aggregate([
    { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
    { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }

  return response.at(0).sumAmount;
}

router.get("/monthlyExpense/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let totalSum = [];
    let sum;
    for (let i = 1; i < 13; i++) {
      sum = await getTotalSumOfMonth(year, i,Expense);
      totalSum.push(sum);
    }

    res.send(totalSum);
  }
});

async function getTotalSumOfMonth(year, month,Expense) {
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

router.get("/weaklyExpense/:year/:month", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    let input, input2;
    input = req.params.year;
    input2 = req.params.month;
    let year = Number.parseInt(input, 10);
    let month = Number.parseInt(input2, 10);
    let totalSum = [];
    let sum;
    let startRange = 1;
    for (let i = 1; i < 5; i++) {
      sum = await getTotalSumOfWeek(year, month, startRange,Expense);
      totalSum.push(sum);
      startRange = startRange + 7;
    }

    res.send(totalSum);
  }
});

async function getTotalSumOfWeek(year, month, startRange,Expense) {
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
      { $group: { _id: null, sumAmount: { $sum: "$amount" } } },
    ]);
  }
  if (response.length == 0) {
    return 0;
  }
  return response.at(0).sumAmount;
}

router.get("/expenseByFilter/:startDate/:endDate", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ExpenseModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Expense = ExpenseModels[dbName];
    let start, end;
    start = req.params.startDate;
    end = req.params.endDate;
    Expense.find(
      { createdAt: { $gte: start, $lte: end } },
      function (err, expenseListResponse) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to find expense",
          });
        } else {
          let count = expenseListResponse.length;
          res.send({
            status: 200,
            totalSales: count,
            expenseList: expenseListResponse,
          });
        }
      }
    );
  }
});

module.exports = router;
