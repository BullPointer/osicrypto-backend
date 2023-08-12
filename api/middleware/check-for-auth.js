const jwt = require("jsonwebtoken");
const Worker = require("../model/worker");

exports.authorize_only_workers = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_KEY);
    const worker = await Worker.findById(userData.userId).exec();

    if (!worker) {
      return res.status(401).json({
        message: "Permission denied",
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
    });
  }
};

exports.authorize_handle_auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_KEY);
    const worker = await Worker.findById(userData.userId).exec();

    if (!worker.isAdmin) {
      return res.status(401).json({
        message: "Permission denied",
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
    });
  }
};

