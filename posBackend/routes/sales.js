var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
// var Sales = require("../models/sales.model");
// const Product = require("../models/product.model");
var ProductModels = require("./users").ProductModels;
var SaleModels = require("./users").SaleModels;
// ProductModels: productModels,
//   SaleModels: salesModels,
//   ReceivingModels: receivingModels,
//   CategoryModels: categoryModels,
//   ExpenseModels: expenseModels,
// var Category = require("../models/category.model");
// var Sales = require("../models/sales.model");
// var Receiving = require("../models/receiving.model");
const ObjectId = require("mongodb").ObjectId;
// Get all Sales
router.get("/list", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    Sales.find(function (err, salesListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Sales",
        });
      } else {
        count = salesListResponse.length;
        res.send({
          status: 200,
          totalSales: count,
          salesList: salesListResponse,
        });
      }
    });
  }
});

// Add Sales
router.post("/add", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];

    const Product = ProductModels[dbName];
    let salesObj = new Sales({
      saleId:Number,
      extra: req.body.extra,
      productsList: req.body.productList,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      givenAmount: req.body.givenAmount,
      changeAmount: req.body.changeAmount,
      createdBy: req.body.user,
      updatedBy: req.body.user,
      updatedAt: Date.now(),
    });
    Sales.findOne()
      .sort({ saleId: -1 })
      .exec(function (err, maxOrder) {
        if (err) return next(err);
        // set the new order ID to be one more than the current max
        salesObj.saleId = maxOrder ? maxOrder.saleId + 1 : 1;
        salesObj.save(function (err, addedSale) {
          if (err) {
            res.send({
              error: err.message,
              status: 500,
              message: "unable to add sales",
            });
          } else {
            let productUpdates = addedSale.productsList.map(async (product) => {
              // Decrement the available quantity of the product
              await Product.findOneAndUpdate(
                { _id: product._productId },
                {
                  $inc: {
                    availableQuantity: -product.quantity,
                    stockOut: +product.quantity,
                  },
                }
              );
            });
            Promise.all(productUpdates).then(() => {
              res.send({
                status: 200,
                message: "Sales Added Successfully",
                salesDetails: addedSale,
              });
            
            });
          }
        });
      });

  }
});

// Update Sales
router.put("/update", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    const Product = ProductModels[dbName];
    var salesId = req.body.saleId;
    let salesObj = {
      productsList: req.body.productList,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      givenAmount: req.body.givenAmount,
      changeAmount: req.body.changeAmount,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };

    // Sales.findOneAndUpdate(
    //   { _id: salesId },
    //   salesObj,
    //   {
    //     returnOriginal: false,
    //   },
    //   function (err, addedSale) {
    //     if (err) {
    //       res.send({ error: err, status: 500, message: "unable to add sales" });
    //     } else {
    //       res.send({
    //         status: 200,
    //         message: "Sales Updated Successfully",
    //         salesDetails: addedSale,
    //       });
    //     }
    //   }
    // );

    Sales.findOne({ _id: salesId }, function (err, oldSale) {
      
      if (err) {
        res.send({ error: err, status: 500, message: "unable to find sale" });
      } else {
        let productUpdates = salesObj.productsList.map(async (product) => {
          // Decrement the available quantity of the product
        
          await Product.findOneAndUpdate(
            { _id: product._productId },
            {
              $inc: {
                availableQuantity: -(
                  product.quantity -
                  oldSale.productsList.find(
                    (p) => p._productId == product._productId
                  ).quantity
                ),
                stockOut:
                  product.quantity -
                  oldSale.productsList.find(
                    (p) => p._productId == product._productId
                  ).quantity,
              },
            }
          );
        });
        Promise.all(productUpdates).then(() => {
          Sales.findOneAndUpdate(
            { _id: salesId },
            salesObj,
            {
              returnOriginal: false,
            },
            function (err, updatedSale) {
              if (err) {
                res.send({
                  error: err,
                  status: 500,
                  message: "unable to update sale",
                });
              } else {
                res.send({
                  status: 200,
                  message: "Sales Updated Successfully",
                  salesDetails: updatedSale,
                });
              }
            }
          );
        });
      }
    });
  }
});

// Delete Sales
router.delete("/delete", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    const Product = ProductModels[dbName];
    var salesId = req.query.saleId;

    Sales.findById(salesId, function (err, sales) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Sales",
        });
      } else {
        let productUpdates = sales.productsList.map(async (product) => {
          // Decrement the available quantity of the product
          await Product.findOneAndUpdate(
            { _id: product._productId },
            {
              $inc: {
                availableQuantity: +sales.productsList.find(
                  (p) => p._productId == product._productId
                ).quantity,
                stockOut: -sales.productsList.find(
                  (p) => p._productId == product._productId
                ).quantity,
              },
            }
          );
        });
        Promise.all(productUpdates).then(() => {
          Sales.findOneAndRemove({ _id: salesId }, function (err) {
            if (err) {
              res.send({
                error: err,
                status: 500,
                message: "unable to delete sales",
              });
            } else {
              res.send({
                status: 200,
                message: "Sales Deleted Successfully",
              });
            }
          });
        });
      }
    });
  }
});

// Get Specific Sales
router.get("/view", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    const salesId = req.query.saleId;
    Sales.findById(salesId, function (err, salesResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Sales",
        });
      } else {
        res.send({
          status: 200,
          sales: salesResponse,
        });
      }
    });
  }
});

// router.get("/salesByYear", function (req, res, next) {
//   const salesId = req.query.salesId;
//   Sales.aggregate([
//     { $match: { GENDER: "F", DOB: { $gte: 19400801, $lte: 20131231 } } },
//     { $group: { _id: "$GENDER", totalscore: { $sum: "$BRAINSCORE" } } },
//   ]);
//   Sales.findById(salesId, function (err, salesResponse) {
//     if (err) {
//       res.send({
//         error: err,
//         status: 500,
//         message: "unable to find Sales",
//       });
//     } else {
//       res.send({
//         status: 200,
//         sales: salesResponse,
//       });
//     }
//   });
// });

router.get("/yearlySales/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let totalSum = [];
    let sum;
    for (let i = 1; i < 6; i++) {
      sum = await getTotalSumOfYear(year, Sales);
      totalSum.push(sum);
      year = year - 1;
    }
    res.send(totalSum);
  }
});

async function getTotalSumOfYear(year, Sales) {
  const response = await Sales.aggregate([
    { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
    { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
  ]);
  if (response.length == 0) {
    return 0;
  }

  return response.at(0).sumAmount;
}

router.get("/monthlySales/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let totalSum = [];
    let sum;
    for (let i = 1; i < 13; i++) {
      sum = await getTotalSumOfMonth(year, i, Sales);
      totalSum.push(sum);
    }

    res.send(totalSum);
  }
});

async function getTotalSumOfMonth(year, month, Sales) {
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

router.get("/weaklySales/:year/:month", async function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    let input, input2;
    input = req.params.year;
    input2 = req.params.month;
    let year = Number.parseInt(input, 10);
    let month = Number.parseInt(input2, 10);
    let totalSum = [];
    let sum;
    let startRange = 1;
    for (let i = 1; i < 5; i++) {
      sum = await getTotalSumOfWeek(year, month, startRange, Sales);
      totalSum.push(sum);
      startRange = startRange + 7;
    }

    res.send(totalSum);
  }
});

async function getTotalSumOfWeek(year, month, startRange, Sales) {
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

router.get("/salesByFilter/:startDate/:endDate", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    let start, end;
    start = req.params.startDate;
    end = req.params.endDate;
    Sales.find(
      { createdAt: { $gte: start, $lte: end } },
      function (err, salesListResponse) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to find Sales",
          });
        } else {
          count = salesListResponse.length;
          res.send({
            status: 200,
            totalSales: count,
            salesList: salesListResponse,
          });
        }
      }
    );
  }
});

router.get("/salesByProduct", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!SaleModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
    const Sales = SaleModels[dbName];
    var productId = req.query.productId;
    Sales.find(
      {
        "productsList._productId": { $eq: ObjectId(productId) },
      },
      function (err, sales) {
        if (err) {
          console.log(err);
        } else {
          console.log(sales);
          res.send({
            count: sales.length,
            sales: sales,
          });
        }
      }
    );
  }
});

module.exports = router;
