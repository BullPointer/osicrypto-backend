const app = require("express");
const mongoose = require("mongoose");
const Visit = require("../model/visit");

exports.get_visitors = (req, res, next) => {
  Visit.find()
    .select("_id visitors views")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Fetch Visitors successfully",
        data: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "UnIdentified error",
        error: error,
      });
    });
};

exports.make_visitors = async (req, res, next) => {
  const visitor = await Visit.find().exec();
  const query = req.query;

  if (req.url === "/favicon.ico") {
    res.end();
  }

  if (visitor.length < 1) {
    const newVisitor = new Visit({
      _id: new mongoose.Types.ObjectId(),
      visitors: 1,
      views: 1,
    });
    newVisitor
      .save()
      .then((result) => {
        res.status(204).json({});
      })
      .catch((error) => {
        res.status(400).json({
          message: "Bad request body",
          error: error,
        });
      });
  } else {
    if (query.visitor == "new-visit") {
      Visit.findOne()
        .exec()
        .then((data) => {
          Visit.findByIdAndUpdate(
            { _id: data._id },
            {
              $set: {
                visitors: data.visitors + 1,
                views: data.views + 1,
              },
            }
          ).then((result) => {
            res.status(204).json({});
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "UnIdentified error",
            error: error,
          });
        });
    }

    if (query.visitor == "existing-visit") {
      Visit.findOne()
        .exec()
        .then((data) => {
          Visit.findByIdAndUpdate(
            { _id: data._id },
            {
              $set: {
                visitors: data.visitors,
                views: data.views + 1,
              },
            }
          ).then((result) => {
            res.status(204).json({});
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "UnIdentified error",
            error: error,
          });
        });
    }
  }
};
