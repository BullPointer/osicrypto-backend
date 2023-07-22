const jwt = require("jsonwebtoken");
const Worker = require("../model/worker");

exports.authorize_delete_users = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_KEY);
    const worker = await Worker.findById(userData.userId).exec();
    const admin = await Worker.find({ isAdmin: true }).exec();

    if (
      worker ||
      userData.userId === req.params.userId ||
      userData.userId === admin[0]._id
    ) {
      req.userData = userData;
      next();
    } else {
      return res.status(401).json({
        message: "Permission denied",
        error: "Auth failed",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Permission denied",
      error: "Auth failed",
    });
  }
};

exports.authorize_delete_staff = async (req, res, next) => {
  try {
    const admin = await Worker.find({ isAdmin: true }).exec();
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_KEY);

    if (
       userData.userId === admin[0]._id
    ) {
      req.userData = userData;
      next();
    } else {
      return res.status(401).json({
        message: "Permission denied",
        error: "Auth failed",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Permission denied",
      error: "Auth failed",
    });
  }
};
