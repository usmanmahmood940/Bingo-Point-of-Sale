var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var ReceivingModels = require("./users").ReceivingModels;
var ProductModels = require("./users").ProductModels;

 

// Get all Receiving
router.get("/list", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    Receiving.find(function (err, receivingListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Receiving",
        });
      } else {
        count = receivingListResponse.length;
        res.send({
          status: 200,
          totalReceiving: count,
          receivingList: receivingListResponse,
        });
      }
    });
  }
});

// Add Receiving
router.post("/add", function (req, res, next) {
 var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    let receivingObj = new Receiving({
      _productId: req.body.productId,
      stockBuy: req.body.stockBuy,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      createdBy: req.body.user,
      updatedBy: req.body.user,
      updatedAt: Date.now(),
    });

    receivingObj.save(function (err, addedReceiving) {
      if (err) {
        res.send({ error: err, status: 500, message: "unable to add receiving" });
      } else {
        Product.findOneAndUpdate(
          { _id: addedReceiving._productId },
          {
            $inc: {
              stockIn: addedReceiving.stockBuy,
              availableQuantity: addedReceiving.stockBuy,
            },
          },
          function (error, product) {
            if (error) {
              // handle error
            } else {
              res.send({
                status: 200,
                message: "Receiving Added Successfully",
                receivingDetails: addedReceiving,
              });
              // do something with the updated product
            }
          }
        );
      
      }
    });
  }
});

// Update Receiving
router.put("/update", function (req, res, next) {
 var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
 
    var receivingId = req.body.receivingId;
    let receivingObj = {
      _productId: req.body.productId,
      stockBuy: req.body.stockBuy,
      discount: req.body.discount,
      totalAmount: req.body.totalAmount,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };

    Receiving.findByIdAndUpdate(
      receivingId,
      receivingObj,
      {
        returnOriginal: true,
      },
      function (err, addedReceiving) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to Receiving and product  receiving",
          });
        } else {
          Product.findOneAndUpdate(
            { _id: addedReceiving._productId },
            {
              $inc: {
                stockIn: receivingObj.stockBuy - addedReceiving.stockBuy,
                availableQuantity:
                  receivingObj.stockBuy - addedReceiving.stockBuy,
              },
            },
            function (error, product) {
              if (error) {
                res.send({
                  error: error,
                  status: 500,
                  message: "Unable to add receiving",
              
                });
              } else {
                res.send({
                  status: 200,
                  message: "Receiving Updated Successfully",
                  receivingDetails: addedReceiving,
                });
              }
            }
          );
        
        }
      }
    );
  }
});

// Update Receiving
router.delete("/delete", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    var receivingId = req.query.receivingId;
    Receiving.findById(receivingId, function (err, receiving) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "Unable to Find Receiving",
        });
      } else {
        Product.findOneAndUpdate(
          { _id: receiving._productId },
          {
            $inc: {
              stockIn: - receiving.stockBuy,
              availableQuantity: - receiving.stockBuy,
            },
          },
          function (error, product) {
            if (error) {
              res.send({
                error: error,
                status: 500,
                message: "Unable to add receiving",
              });
            } else {
              Receiving.findOneAndRemove({ _id: receivingId }, function (err) {
                if (err) {
                  res.send({
                    error: err,
                    status: 500,
                    message: "Unable to delete receiving",
                  });
                } else {
                  res.send({
                    status: 200,
                    message: "Receiving Deleted Successfully",
                  });
                }
              });
            }
          }
        );
      
        // res.send({
        //   status: 200,
        //   receiving: receivingResponse,
        // });
      }
    });
  }
});

// Get Specific Receiving
router.get("/view", function (req, res, next) {
 var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
 
    const receivingId = req.query.receivingId;
    Receiving.findById(receivingId, function (err, receivingResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Receiving",
        });
      } else {
        res.send({
          status: 200,
          receiving: receivingResponse,
        });
      }
    });
  }
});

 router.get("/yearlyReceiving/:year", async function (req, res, next) {
  var dbName = req.query.dbName;
   if (!ReceivingModels[dbName]) {
     res.send({
       status: 500,
       message: "You are not login",
     });
   }
   else {
     const Receiving = ReceivingModels[dbName];
     const Product = ProductModels[dbName];
     let input;
     input = req.params.year;
     let year = Number.parseInt(input, 10);
     let totalSum = [];
     let sum;
     for (let i = 1; i < 6; i++) {
       sum = await getTotalSumOfYear(year,Receiving);
       totalSum.push(sum);
       year = year - 1;
     }
     res.send(totalSum);
   }
 });

 async function getTotalSumOfYear(year,Receiving) {
   const response = await Receiving.aggregate([
     { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
     { $group: { _id: null, sumAmount: { $sum: "$totalAmount" } } },
   ]);
   if (response.length == 0) {
     return 0;
   }

   return response.at(0).sumAmount;
}
 
router.get("/monthlyReceiving/:year", async function (req, res, next) {
   var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    let input;
    input = req.params.year;
    let year = Number.parseInt(input, 10);
    let totalSum = [];
    let sum;
    for (let i = 1; i < 13; i++) {
      sum = await getTotalSumOfMonth(year, i,Receiving);
      totalSum.push(sum);
    }

    res.send(totalSum);
  }
 });

 async function getTotalSumOfMonth(year, month,Receiving) {
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

router.get("/weaklyReceiving/:year/:month", async function (req, res, next) {
   var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    let input, input2;
    input = req.params.year;
    input2 = req.params.month;
    let year = Number.parseInt(input, 10);
    let month = Number.parseInt(input2, 10);
    let totalSum = [];
    let sum;
    let startRange = 1;
    for (let i = 1; i < 5; i++) {
      sum = await getTotalSumOfWeek(year, month, startRange,Receiving);
      totalSum.push(sum);
      startRange = startRange + 7;
    }

    res.send(totalSum);
  }
 });

 async function getTotalSumOfWeek(year, month, startRange,Receiving) {
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
 
router.get("/receivingByFilter/:startDate/:endDate", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    let start, end;
    start = req.params.startDate;
    end = req.params.endDate;
    Receiving.find(
      { createdAt: { $gte: start, $lte: end } },
      function (err, receivingListResponse) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to find receiving",
          });
        } else {
          count = receivingListResponse.length;
          res.send({
            status: 200,
            totalSales: count,
            receivingList: receivingListResponse,
          });
        }
      }
    );
  }
});

router.get("/receivingByProduct", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ReceivingModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Receiving = ReceivingModels[dbName];
    const Product = ProductModels[dbName];
    var productId = req.query.productId;
    Receiving.find(
      {
        "_productId": { $eq: productId },
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
