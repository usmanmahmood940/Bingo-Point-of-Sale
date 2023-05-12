const mongoose = require("mongoose");

const dbURL = require("../properties").DB_URL;
const dbName = require("../properties").DB_NAME;
const conn = mongoose.createConnection(dbURL, {
  dbName: dbName,
});

conn.on("connected", () => {
  console.log("Connected to " + dbName + " using MongooseJs");
});


// conn.close("disconnect", () => {
//   console.log("DisConnected to MongoDb using MongooseJs");
// });

const userModel = conn.model(
  "User",
  require("../schemas/user.schema").userSchema
);
// const tokenModel = conn.model(
//   "Token",
//   require("../schemas/user.schema").tokenSchema
// );

module.exports = {
  userModel: userModel,
  // tokenModel: tokenModel,
  conn: conn
};
