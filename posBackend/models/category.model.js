const mongoose = require("mongoose");
// const conn = require('../app').conn;

var categorySchema = new mongoose.Schema({
  name: String,
  detail: { type: String, default: "No Details" },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: String,
  updatedAt: {
    type: Date,
    required: true,
  },
  updatedBy: String,
});

const categoryModel = mongoose.model("Category", categorySchema);
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = categoryModel;
