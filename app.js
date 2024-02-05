const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const workerRoute = require("./api/routes/worker");
const userRoute = require("./api/routes/user");
const blogRoute = require("./api/routes/blog");
const supportRoute = require("./api/routes/support");
const faqRoute = require("./api/routes/faq");
const visitorRoute = require("./api/routes/visit");
const locationRoute = require("./api/routes/location");
const privacyPolicyRoute = require("./api/routes/privacyPolicy");
const termAndConditionRoute = require("./api/routes/termAndCondition");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGO_ATLAS_USR_NAME +
      ":" +
      process.env.MONGO_ATLAS_PASSWD +
      "@node-rest-shop.k0ws24f.mongodb.net/"
  )
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(`Error found to be ${err.message}`));

app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/admin-panel/users", workerRoute);
app.use("/users", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/supports", supportRoute);
app.use("/api/faqs", faqRoute);
app.use("/api/visitors", visitorRoute);
app.use("/api/locations", locationRoute);
app.use("/api/privacy-policy", privacyPolicyRoute);
app.use("/api/term-and-condition", termAndConditionRoute);

app.use((req, res, next) => {
  const error = new Error("Unrecongnized Request");
  error.status = 409;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message,
  });
});

module.exports = app;
