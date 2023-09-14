const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Worker = require("../model/worker");

exports.allow_only_users = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.decode(token, process.env.JWT_KEY);
    const user = await User.findById(userData.userId).exec();
    if (!user) {
      return res.status(401).json({
        message: "User not identified",
        error: "Auth failed",
      });
    } else {
      req.userData = userData;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Permission denied",
      error: "Auth failed",
      err: error,
    });
  }
};

exports.allow_only_admin_authorized = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.decode(token, process.env.JWT_KEY);
    const worker = await Worker.findById(userData.userId).exec();
    if (!worker) {
      return res.status(401).json({
        message: "User not identified",
        error: "Auth failed",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Permission denied",
      error: "Auth failed",
      err: error,
    });
  }
};

exports.allow_only_authorized = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.decode(token, process.env.JWT_KEY);
    const user = await User.findById(userData.userId).exec();
    const worker = await Worker.findById(userData.userId).exec();
    if (!user || !worker) {
      return res.status(401).json({
        message: "User not identified",
        error: "Auth failed",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Permission denied",
      error: "Auth failed",
      err: error,
    });
  }
};
