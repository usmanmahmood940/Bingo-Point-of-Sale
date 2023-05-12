const mongoose = require("mongoose");
// const conn = require('../app').conn;

var expenseSchema = new mongoose.Schema({
  name: String,
  detail: { type: String, default: "No Details" },
  amount: Number,
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

const expenseModel = mongoose.model("Expense", expenseSchema);
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = expenseModel;
