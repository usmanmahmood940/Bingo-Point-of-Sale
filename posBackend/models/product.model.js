const mongoose = require("mongoose");
// const conn = require('../app').conn;

var productSchema = new mongoose.Schema({
  code: {
    type: Number,
    unique: true,
    required: true,
  },
  name: String,
  _categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  detail: String,
  price: { type: Number, required: true },
  unit: String,
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
  availableQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  stockIn: {
    type: Number,
    required: true,
    default: 0,
  },
  stockOut: {
    type: Number,
    required: true,
    default: 0,
  },
});
productSchema.index({ code: 1 }, { unique: true });
const productModel = mongoose.model("Product", productSchema);
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = productModel;
  
