const mongoose = require("mongoose");
// const conn = require('../app').conn;

var receivingSchema = new mongoose.Schema({
  name: String,
  _productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  stockBuy: Number,
  discount: Number,
  totalAmount: { type: Number, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: String,
  updatedAt: {
    type: Date,
    required: true
  },
  updatedBy: String,
});

const receivingModel = mongoose.model("Receiving", receivingSchema);
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = receivingModel;
