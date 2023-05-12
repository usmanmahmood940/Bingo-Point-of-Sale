const { Console } = require("console");
const mongoose = require("mongoose");
// const conn = require('../app').conn;

var salesSchema = new mongoose.Schema({
  saleId: { type: Number, required: true, default: 0 },
  productsList: [
    {
      _productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      totalProductAmount: Number,
    },
  ],
  discount: Number,
  totalAmount: { type: Number, required: true },
  givenAmount: { type: Number, required: true },
  changeAmount: { type: Number, required: true },
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

// salesSchema.pre("save", function (next) {
//   const doc = this;
//   // find the current max order ID
//   mongoose.models.Sales.findOne()
//     .sort({ saleId: -1 })
//     .exec(function (err, maxOrder) {
//       if (err) return next(err);
//       // set the new order ID to be one more than the current max
//       doc.saleId = maxOrder ? maxOrder.saleId + 1 : 1;
//       next();
//     });
// });
// salesSchema.pre("save", function (next) {
//   console.log("Here it comes");
//   const sale = this;
//   const productUpdates = sale.productsList.map(async (product) => {
//     // Decrement the available quantity of the product
//     await mongoose.models.Product.findByIdAndUpdate(product._productId, {
//       $inc: { availableQuantity: -product.quantity },
//     });
//     // Increment the stock buy quantity of the product
//     await mongoose.models.Product.findByIdAndUpdate(product._productId, {
//       $inc: { stockOut: product.quantity },
//     });
//   });
//   Promise.all(productUpdates).then(() => next());
// });

const salesModel = mongoose.model("Sales", salesSchema);

// salesModel.pre("findOneAndUpdate", async function (next) {
//   console.log("Here it comes");
//   const sale = this._update;

//   const oldSale = await salesModel.findById(sale._id);
//   console.log(JSON.stringify(oldSale));
//   const productUpdates = sale.productsList.map(async (product) => {
//     // Decrement the available quantity of the product
//     await mongoose.models.Product.findByIdAndUpdate(product._productId, {
//       $inc: {
//         availableQuantity: -(
//           product.quantity -
//           oldSale.productsList.find((p) => p._productId == product._productId)
//             .quantity
//         ),
//       },
//     });
//     // Increment the stock buy quantity of the product
//     await mongoose.models.Product.findByIdAndUpdate(product._productId, {
//       $inc: {
//         stockOut: -(
//           product.quantity -
//           oldSale.productsList.find((p) => p._productId == product._productId)
//             .quantity
//         ),
//       },
//     });
//   });
//   Promise.all(productUpdates).then(() => next());
// });
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = salesModel;
