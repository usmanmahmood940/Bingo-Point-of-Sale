const { count } = require("console");
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
var CategoryModels = require("./users").CategoryModels;


// var Category = require("../models/category.model");
// var Sales = require("../models/sales.model");
// var Receiving = require("../models/receiving.model");

// Get all Categories
router.get("/list", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!CategoryModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Category = CategoryModels[dbName];
    Category.find(function (err, cateogriesListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Category",
        });
      } else {
        let count = cateogriesListResponse.length;
        res.send({
          status: 200,
          totalCategories: count,
          categoryList: cateogriesListResponse,
        });
      }
    });
  }
});

// Add Category
router.post("/add", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!CategoryModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Category = CategoryModels[dbName];
    let categoryObj = new Category({
      name: req.body.name,
      detail: req.body.detail,
      createdBy: req.body.user,
      updatedBy: req.body.user,
      updatedAt: Date.now(),
    });

    categoryObj.save(function (err, addedCategory) {
      if (err) {
        res.send({ error: err, status: 500, message: "Unable to add category" });
      } else {
        res.send({
          status: 200,
          message: "Category Added Successfully",
          category: addedCategory,
        });
      }
    });
  }
});

// Update Category
router.put("/update", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!CategoryModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Category = CategoryModels[dbName];
    var categoryId = req.body.categoryId;
    const categoryObj = {
      name: req.body.name,
      detail: req.body.detail,
      updatedAt: Date.now(),
      updatedBy: req.body.user,
    };

    Category.findByIdAndUpdate(
      categoryId,
      categoryObj,
      {
        returnOriginal: false,
      },
      function (err, updatedCategory) {
        if (err) {
          res.send({
            error: err,
            status: 500,
            message: "unable to Update Category",
          });
        } else {
          res.send({
            status: 200,
            message: "Category Updated Successfully",
            category: updatedCategory,
          });
        }
      }
    );
  }
});

// Delete Category
router.delete("/delete", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!CategoryModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Category = CategoryModels[dbName];
    var categoryId = req.query.categoryId;

    Category.findOneAndRemove({ _id: categoryId }, function (err) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to delete Category",
        });
      } else {
        res.send({
          status: 200,
          message: "Category Deleted Successfully",
        });
      }
    });
  }
});

// Get Specific Category
router.get("/view", function (req, res, next) {
  var dbName = req.query.dbName;
  if (!CategoryModels[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  }
  else {
    const Category = CategoryModels[dbName];
    const categoryId = req.query.categoryId;
    Category.findById(categoryId, function (err, cateogryResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Category",
        });
      } else {
        res.send({
          status: 200,
          category: cateogryResponse
        });
      }
    });
  }
});
module.exports = router;
