var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../models/user.model").userModel;
// var Token = require("../models/user.model").tokenModel;
var productSchema = require("../models/product.model").schema;
var categorySchema = require("../models/category.model").schema;
var salesSchema = require("../models/sales.model").schema;
var receivingSchema = require("../models/receiving.model").schema;
var expensesSchema = require("../models/expense.model").schema
var crypto = require("crypto");
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const salesModel = require("../models/sales.model");
const dbURL = require("../properties").DB_URL;
const connections = {};
const productModels = {};
const categoryModels = {};
const salesModels = {};
const receivingModels = {};
const expenseModels = {};
// const connections = {};
// const Product = require("./models/Product");
// const models = {
//   Product: Product,
//   Category: Category,
//   Sales: Sales,
//   Receiving: Receiving,
//   Expense: Expenses,
// };

// const getModel = (connection, name) => {
//   return connection.model(name, models[name].schema);
// };

// const clientId = "679758834427-2oqhsnm1rqk0jnqc054k66eof2fprqr1.apps.googleusercontent.com";
// const clientSecret = "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";
// const refreshToken =
//   "1//04ctjAgpWTlirCgYIARAAGAQSNwF-L9Irpy1BCb171TVT1RrznzI_6ytYynWMOPl-lZL2rAYVkHUMJgH1OwKIqiw4HoQpdoQ7Rzs";

// const accessToken =
//   "ya29.a0AX9GBdVfLOCuKBm6sbUEgqV6Xlw8ML7MqUZnqxjd8ACi87-_Wy47u581Lz8FvnUMadA8no2v4y96mPBLj5vxhiWc96a2zVb_Ezkmv6dnn5gqcu7_JWQhdFki6vRqp2M2SE3q6PmsMmsWo0ygks84ExMEswT0p9gaCgYKAZ0SAQASFQHUCsbCta0qmQ4CnFaxCRKr1UyXdg0166";
// const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
/* Login API */

// router.post("/login", function (req, res, next) {
//   // Check for validation erro

//   User.findOne(
//     { email: req.body.email, password: req.body.password },
//     function (err, user) {
//       if (!user)
//         return res.status(401).send({
//           msg:
//             "The email address " +
//             req.body.email +
//             " is not associated with any account. Double-check your email address and try again.",
//         });
//       else {
//         if (!user.isVerified)
//           return res.status(401).send({
//             type: "not-verified",
//             msg: "Your account has not been verified. Please Check your email",
//           });
//         else {
//           if (connections[user.dbName]) {
//             connections[user.dbName].close();
//           }
//           connections[user.dbName] = mongoose.createConnection(dbURL, {
//             dbName: user.dbName,
//           });
//           connections[user.dbName]
//             .then(() => {
//               const ProductModel = connections[user.dbName].model(
//                 "Product",
//                 Product.schema
//               );

//               // const ProductModel = getModel(
//               //   connections[user.dbName],
//               //   "Product"
//               // );
//               const C = connections[user.dbName].model(
//                 "Product",
//                 Product.schema
//               );
//               console.log("Connected to Database " + ProductModel.db.name);
//               msg = "db created";
//               res.send({ status: 200, MSG: msg, user: user });
//             })
//             .catch((err) => {
//               console.log("Not Connected to Database ERROR! ");
//               res.send({ status: 500, MSG: err });
//             });
//           // res.send({ status: 200, user: user });
//         }
//       }
//     }
//   );
// });
router.post("/login", function (req, res, next) {
  // Check for validation erro

  User.findOne(
    { email: req.body.email, password: req.body.password },
    function (err, user) {
      if (!user)
        return res.status(401).send({
          msg:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again.",
        });
      else {
        if (!user.isVerified) {
          return res.status(401).send({
            type: "not-verified",
            msg: "Your account has not been verified. Please Check your email",
          });
        }
        else {
           if (connections[user.dbName]) {
             connections[user.dbName].close(function () {
               console.log("Mongoose connection closed");
             });
           }
          console.log(user.dbName);
          connections[user.dbName] = mongoose.createConnection(dbURL, {
            dbName: user.dbName,
          });
          productModels[user.dbName] = connections[user.dbName].model(
            "Product",
            productSchema
          );
          salesModels[user.dbName] = connections[user.dbName].model(
            "Sales",
            salesSchema
          );
          receivingModels[user.dbName] = connections[user.dbName].model(
            "Receiving",
            receivingSchema
          );
          categoryModels[user.dbName] = connections[user.dbName].model(
            "Category",
            categorySchema
          );
           expenseModels[user.dbName] = connections[user.dbName].model(
             "Expense",
             expensesSchema
           );
          
          connections[user.dbName].on("connected", () => {
            console.log("Connected to " + user.dbName + " using MongooseJs");
            msg = "db created";
           res.send({ status: 200, MSG: msg, user: user });
          });
           
          // res.send({ status: 200, user: user });
        }
      }
    }
  );
});
// router.post("/login", function (req, res, next) {
//   // Check for validation erro

//   User.findOne(
//     { email: req.body.email, password: req.body.password },
//     function (err, user) {
//       if (!user)
//         return res.status(401).send({
//           msg:
//             "The email address " +
//             req.body.email +
//             " is not associated with any account. Double-check your email address and try again.",
//         });
//       else {
//         if (!user.isVerified)
//           return res.status(401).send({
//             type: "not-verified",
//             msg: "Your account has not been verified. Please Check your email",
//           });
//         else {
//           if (mongoose.connection.readyState == 1) {
//             console.log("Mongoose state : " + mongoose.connection.readyState);
//             mongoose.connection.close();
//             console.log("Mongoose state : " + mongoose.connection.readyState);
//           }
//           mongoose
//             .connect(dbURL, { dbName: user.dbName })
//             .then(() => {
//               console.log("Connected to Database " + Product.db.name);
//               msg = "db created";
//               res.send({ status: 200, MSG: msg, user: user });
//             })
//             .catch((err) => {
//               console.log("Not Connected to Database ERROR! ");
//               res.send({ status: 500, MSG: err });
//             });
//           // res.send({ status: 200, user: user });
//         }
//       }
//     }
//   );
// });

router.post("/signup", function (req, res, next) {
  //   const oAuth2Client = new google.auth.OAuth2(
  //   CLIENT_ID,
  //   CLIENT_SECRET,
  //   REDIRECT_URL,
  //   { access_type: 'offline' }
  // );
  let input = req.body.dbName;
  let dbName = input.replace(/\s/g, "");
  let userObj = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    brandName: req.body.brandName,
    dbName: dbName,
    mobileNumber: req.body.mobileNumber,
  });
  userObj.save(function (err, addedUser) {
    if (err) {
      res.send({
        status: 500,
        msg: "Error" + err.message,
      });
    } else {
      
          // Send the email

          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "dbproject888@gmail.com",
              pass: "mjwahdotobdpfspm",
            },
          });

          var mailOptions = {
            to: addedUser.email,
            subject: "Account Verification ",
            text:
              "Hello,\n\n" +
              "Please verify your account by clicking the link: \nhttp://localhost:4200/bingoPOS/" +
              "confirmation/" +
              addedUser._id,
          };

          transporter.sendMail(mailOptions, (error, response) => {
            error
              ? res.send({
                  status: 500,
                  msg: error.message,
                  msg2: "EMail main panga hy",
                })
              : res.send({
                  status: 200,
                  msg:
                    "User Added Successfully and Mail has been Sent to  " +
                    addedUser.email,
                });
            transporter.close();
          });
        
      
    }
  });
});

router.post("/forgetPassword", function (req, res, next) {
  const email = req.body.email;
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.send({
        status: 500,
        msg:
          "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
      });
    else {
       var transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
           user: "dbproject888@gmail.com",
           pass: "mjwahdotobdpfspm",
         },
       });


      var mailOptions = {
        to: email,
        subject: " BingoPOS Forget Password ",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://localhost:4200/bingoPOS/" +
          "changePassword/" +
          user._id,
      };

      transporter.sendMail(mailOptions, (error, response) => {
        error
          ? res.send({
              status: 500,
              msg: error.message,
              msg2: "EMail main panga hy",
            })
          : res.send({
              status: 200,
              msg: " Mail has been Sent to  " + user.email,
            });
        transporter.close();
      });
    }
  });
});

router.get("/list", function (req, res, next) {
  const dbName = req.query.dbName;
  User.find(
    {
      $and: [
        { dbName: { $eq: dbName } },
        { role: { $ne: "masterAdmin" } },
      ],
    },
    function (err, userListResponse) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to find Users",
        });
      } else {
        count = userListResponse.length;
        res.send({
          status: 200,
          totalUsers: count,
          userList: userListResponse,
        });
      }
    }
  );
});

router.post("/add", function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      res.send({
        status: 500,
        msg: "The email address you have entered is already associated with another account.",
      });
    } else {
      let userObj = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        address: req.body.address,
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,
        salary: req.body.salary,
        brandName: req.body.brandName,
        dbName: req.body.dbName,
        cnic: req.body.cnic,
        isVerified:true
      });
      userObj.save(function (err, addedUser) {
        if (err) {
          res.send({
            status: 500,
            msg: "Error" + err.message,
          });
        } else {
          res.send({
            status: 200,
            message: "User Added Successfully ",
          });
        }
      });
    }
  });
});

router.put("/update", function (req, res, next) {
  var userId = req.body.userId;
  const userObj = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber,
    salary: req.body.salary,
    cnic: req.body.cnic,
    address: req.body.address,
  };
  User.findByIdAndUpdate(
    userId,
    userObj,
    {
      returnOriginal: false,
    },
    function (err, updatedUser) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          message: "unable to add User",
        });
      } else {
        res.send({
          status: 200,
          message: "User Updated Successfully",
          User: updatedUser,
        });
      }
    }
  );
});

router.get("/view", function (req, res, next) {
  const userId = req.query.userId;
  User.findById(userId, function (err, user) {
    if (err) {
      res.send({
        error: err,
        status: 500,
        message: "unable to find User",
      });
    } else {
      count = user.length;
      res.send({
        status: 200,
        totalUsers: count,
        user: user,
      });
    }
  });
});

router.put("/updatePassword", function (req, res, next) {
  var userId = req.body.userId;
  const userObj = {
    password: req.body.password,
  };
  User.findByIdAndUpdate(
    userId,
    userObj,
    {
      returnOriginal: false,
    },
    function (err, updatedUser) {
      if (err) {
        res.send({
          error: err,
          status: 500,
          msg: "unable to Update Password",
        });
      } else {
        res.send({
          status: 200,
          msg: "Password Updated Successfully",
          User: updatedUser,
        });
      }
    }
  );
});

router.delete("/delete", function (req, res, next) {
  const userId = req.query.userId;
  User.findOneAndRemove({ _id: userId }, function (err) {
    if (err) {
      res.send({
        error: err,
        status: 500,
        message: "unable to delete User",
      });
    } else {
      res.send({
        status: 200,
        message: "User Deleted Successfully",
      });
    }
  });
});

/* Confirmation  API */
router.post("/confirmation", function (req, res, next) {
  User.findOne({ _id: req.body.userId }, function (err, user) {
    if (!user)
      return res
        .status(400)
        .send({ msg: "We were unable to find a user." });
    else if (user.isVerified)
      return res.status(400).send({
        type: "already-verified",
        msg: "This user has already been verified.",
      });

    // Verify and save the user
    user.isVerified = true;
    user.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      res
        .status(200)
        .send({ msg: "The account has been verified. Please log in." });
    });
  });
});

router.get("/checkDbName", function (req, res, next) {
  let input = req.query.dbName;
  let dbName = input.replace(/\s/g, "");
  console.log(dbName);
  User.exists({ dbName: dbName }, function (err, check) {
    if (err) {
      res.send({ status: 500, error: err, msg: "some error occur" });
    } else {
      if (check) res.send({ status: 200, isExist: true });
      else res.send({ status: 200, isExist: false });
    }
  });
});
router.get("/checkEmail", function (req, res, next) {
  let Email = req.query.email;
  User.exists({ email: Email }, function (err, check) {
    if (err) {
      res.send({ status: 500, error: err, msg: "some error occur" });
    } else {
      if (check) res.send({ status: 200, isExist: true });
      else res.send({ status: 200, isExist: false });
    }
  });
});

router.post("/feedback", function (req, res, next) {
  const email = req.body.email;
  const message = req.body.message
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dbproject888@gmail.com",
          pass: "mjwahdotobdpfspm",
        },
      });

      var mailOptions = {
        to: "dbproject888@gmail.com",
        subject: " Bingo POS User Feedback ",
        text:
          "Feedback From: "+ email + "\n\n" +
          "Feedback: " +
          message
      };

      transporter.sendMail(mailOptions, (error, response) => {
        error
          ? res.send({
              status: 500,
              message: error.message,
              msg2: "EMail main panga hy",
            })
          : res.send({
              status: 200,
              message: " You will get respose to your email",
            });
        transporter.close();
      });
    
});

/* Resend Confirmation  API */
// router.post("/resend", function (req, res, next) {
//   User.findOne({ email: req.body.email }, function (err, user) {
//     if (!user)
//       return res
//         .status(400)
//         .send({ msg: "We were unable to find a user with that email." });
//     if (user.isVerified)
//       return res.status(400).send({
//         msg: "This account has already been verified. Please log in.",
//       });

//     // Create a verification token, save it, and send email
//     var token = new Token({
//       _userId: user._id,
//       token: crypto.randomBytes(16).toString("hex"),
//     });

//     // Save the token
//     token.save(function (err) {
//       if (err) {
//         return res.status(500).send({ msg: err.message });
//       }

//       // Send the email
//       var transporter = nodemailer.createTransport({
//         service: "Sendgrid",
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_PASSWORD,
//         },
//       });
//       var mailOptions = {
//         from: "no-reply@codemoto.io",
//         to: user.email,
//         subject: "Account Verification Token",
//         text:
//           "Hello,\n\n" +
//           "Please verify your account by clicking the link: \nhttp://" +
//           req.headers.host +
//           "/confirmation/" +
//           token.token +
//           ".\n",
//       };
//       transporter.sendMail(mailOptions, function (err) {
//         if (err) {
//           return res.status(500).send({ msg: err.message });
//         }
//         res
//           .status(200)
//           .send("A verification email has been sent to " + user.email + ".");
//       });
//     });
//   });
// });
router.get("/logout", function (req, res, next) {
  dbName = req.query.dbName;
  if (!connections[dbName]) {
    res.send({
      status: 500,
      message: "You are not login",
    });
  } else {
      connections[dbName].close(function () {
      console.log("Mongoose connection closed");
      delete connections[dbName];
        delete productModels[dbName];
        delete salesModels[dbName];
        delete receivingModels[dbName];
        delete categoryModels[dbName];
        delete expenseModels[dbName];
      res.send({ status: 200, msg: "Connection Closed" });
    });
  }
  
});

router.post("/sendmail", async function (req, res) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dbproject888@gmail.com",
      pass: "mjwahdotobdpfspm",
    },
  });

  var mailOptions = {
    to: "s2019266041@umt.edu.pk",
    subject: " BingoPOS Forget Password ",
    text:
      "Hello,\n\n" +
      "Please verify your account by clicking the link: \nhttp://localhost:4200/bingoPOS/" +
      "changePassword/",
  };

  transporter.sendMail(mailOptions, (error, response) => {
    error
      ? res.send({
          status: 500,
          msg: error.message,
          msg2: "EMail main panga hy",
        })
      : res.send({
          status: 200,
          msg: " Mail has been Sent to  ",
        });
    transporter.close();
  });
});

module.exports = {
  router: router,
  ProductModels: productModels,
  SaleModels: salesModels,
  ReceivingModels: receivingModels,
  CategoryModels: categoryModels,
  ExpenseModels: expenseModels,
};
