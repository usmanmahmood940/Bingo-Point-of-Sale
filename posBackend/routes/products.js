var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
var ProductModels = require("./users").ProductModels;



// var Category = require("../models/category.model");
// var Sales = require("../models/sales.model");
// var Receiving = require("../models/receiving.model");

// Get all Customers
router.get("/list", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    Product.find(function (err, productListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Products",
        });
      } else {
        count = productListResponse.length;
        res.send({
          status: 200,
          totalProducts: count,
          productList: productListResponse,
        });
      }
    });
  }
});

// Add Product
router.post("/add", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    let productObj = new Product({
      code: req.body.code,
      name: req.body.name,
      _categoryId: req.body.categoryId,
      detail: req.body.detail,
      price: req.body.price,
      unit: req.body.unit,
      createdBy: req.body.user,
      updatedBy: req.body.user,
      updatedAt: Date.now(),
    });

    productObj.save(function (err, addedProduct) {
      if (err) {
        res.send({ error: err, status: 500, message: err.message });
      } else {
        res.send({
          status: 200,
          message: "Product Added Successfully",
          productDetails: addedProduct,
        });
      }
    });
  }
});

// Update Product

router.put("/update", function (req, res, next) {
 var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    var productId = req.body.Id;
    //   let productObj = new Product({
    //   name: req.body.name,
    //   category: req.body.category,
    //   detail: req.body.detail,
    //   price: req.body.price,
    //   unit: req.body.unit,
    //   stockIn: req.body.stockIn,
    //   stockOut: req.body.stockOut,
    //   availableQuantity: req.body.availableQuantity
    //   });
    const filter = {
      name: req.body.name,
      code: req.body.code,
      _categoryId: req.body.categoryId,
      detail: req.body.detail,
      price: req.body.price,
      unit: req.body.unit,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };
    Product.findByIdAndUpdate(
      productId,
      filter,
      {
        returnOriginal: false,
      },
      function (err, updatedProduct) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: err.message,
          });
        } else {
          res.send({
            status: 200,
            message: "Product Updated Successfully",
            productDetails: updatedProduct,
          });
        }
      }
    );
  }
});

// Update Prodcut stock
router.put("/updateInventory", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    var productId = req.body.Id;
    //   let productObj = new Product({
    //   name: req.body.name,
    //   category: req.body.category,
    //   detail: req.body.detail,
    //   price: req.body.price,
    //   unit: req.body.unit,
    //   stockIn: req.body.stockIn,
    //   stockOut: req.body.stockOut,
    //   availableQuantity: req.body.availableQuantity
    //   });
    const filter = {
      stockIn: req.body.stockIn,
      stockOut: req.body.stockOut,
      availableQuantity: req.body.availableQuantity,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };
    Product.findByIdAndUpdate(
      productId,
      filter,
      {
        returnOriginal: false,
      },
      function (err, updatedProduct) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to add product",
          });
        } else {
          res.send({
            status: 200,
            message: "Product Updated Successfully",
            productDetails: updatedProduct,
          });
        }
      }
    );
  }
});
// Delete Product
router.delete("/delete", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    const productId = req.query.productId;
    console.log("productId query::::", req.query);
    console.log("productId param::::", req.params);
    Product.findOneAndRemove({ _id: productId }, function (err) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to delete product",
        });
      } else {
        res.send({
          status: 200,
          message: "Product Deleted Successfully",
        });
      }
    });
  }
});

// Get Specific Product
router.get("/view", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    const productId = req.query.productId;
    Product.findById(productId, function (err, productResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Products",
        });
      } else {
        res.send({
          status: 200,
          product: productResponse,
        });
      }
    });
  }
});

router.get("/productByCategory", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    const categoryId = req.query.categoryId;
    Product.find(
      { _categoryId: { $eq: categoryId } },
      function (err, productResponse) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to find Products",
          });
        } else {
          res.send({
            status: 200,
            count: productResponse.length,
            product: productResponse,
          });
        }
      }
    );
  }
});

router.get("/topProducts", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!ProductModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Product = ProductModels[dbName];
    Product.find({})
      .sort({ stockOut: -1 })
      .limit(5)
      .exec(function (err, docs) {
        if (!err) {
          res.send({
            status: 200,
            totalProducts: docs.length,
            productList: docs,
          });
        } else {
          res.send({
            error: err,
            status: 500,
            message: "unable to find Products",
          });
        }
      });
  }
});

//  router.get("/sumProducts/:year",async function (req, res, next) {
//   // const salesId = req.query.salesId;
//    let input;
//    input = req.params.year;
//    const year = Number.parseInt(input, 10);

//    let totalSum = [];
//    totalSum = await getSumArray(year);

//   res.send("Sum Of Years = " + totalSum);

// });
// async function getSumArray(year) {
//   let totalSum = [];
//   let sum = await getTotalSum(year);

//   totalSum.push(sum);
//   sum = await getTotalSum(year-1);
//   totalSum.push(sum);
//   return totalSum;
// }
//  async function getTotalSum(year){
//    const response = await Product.aggregate([
//      { $match: { $expr: { $eq: [{ $year: "$createdAt" }, year] } } },
//      { $group: { _id: null, totalPrice: { $sum: "$price" } } },
//    ]);

//    return response.at(0).totalPrice;
// }

module.exports = router;
