const mongoose = require("mongoose");

var userschema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  role: String,
  isVerified: { type: Boolean, default: false },
  password: String,
  brandName: String,
  dbName: { type: String, required: true },
  mobileNumber: String,
  salary: Number,
  cnic:Number,
  address: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});


// const tokenschema = new mongoose.Schema({
//     _userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: "User",
//     },
//     token: { type: String, required: true },
//     createdAt: { type: Date, required: true, default: Date.now},
// });
// const userModel = mongoose.model("User", userSchema);
// const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = {
  userSchema: userschema,
  // tokenSchema: tokenschema
};