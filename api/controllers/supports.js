const mongoose = require("mongoose");
const Support = require("../model/support");
const { delete_uploaded_image } = require("../utils/handle-files");

exports.get_all_support = (req, res) => {
  Support.find()
    .select(
      "_id status category subject priority email username createdDate lastUpdated messages"
    )
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Support data fetched successfully",
        data: data,
        method: "GET",
        request: "api.osicrypto.com/api/supports/:id",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_all_support_by_user = (req, res) => {
  Support.find({ email: req.userData.email })
    .select(
      "_id status category subject priority email username createdDate lastUpdated messages"
    )
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Support data fetched successfully",
        data: data,
        method: "GET",
        request: "api.osicrypto.com/api/supports/:id",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_support = (req, res) => {
  const id = req.params.id;
  Support.findById(id)
    .select(
      "_id status category subject priority email username createdDate lastUpdated messages"
    )
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Support data fetched successfully",
        data: data,
        method: "GET",
        request: "api.osicrypto.com/api/supports",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_support = (req, res, next) => {
  try {
    const support = new Support({
      _id: new mongoose.Types.ObjectId(),
      status: req.body.status,
      category: req.body.category,
      subject: req.body.subject,
      priority: req.body.priority,
      email: req.userData.email,
      username: req.userData.username,
      createdDate: req.body.createdDate,
      lastUpdated: req.body.lastUpdated,
      messages: [
        {
          fromAdmin: req.body.message.fromAdmin,
          msg: req.body.message.msg,
          fileImage: req.file && req.file.path,
        },
      ],
    });
    support
      .save()
      .then((data) => {
        return res.status(201).json({
          message: "Support Request created successfully",
          data: data,
          request: {
            type: "GET",
            description: "Get all support requests",
            url: `https://api.osicrypto.com/api/supports/`,
          },
        });
      })
      .catch((err) => {
        req.file && delete_uploaded_image(req.file.filename);
        res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    delete_uploaded_image(req.file.filename);
    res.status(500).json({
      error: err,
    });
  }
};

exports.delete_support = (req, res, next) => {
  const id = req.params.id;
  Support.findById(id)
    .exec()
    .then((support) => {
      if (!support) {
        return res.status(404).json({
          message: "Support Request data not found",
        });
      }
      if (support.fileImage) {
        delete_uploaded_image(support.fileImage.split("/")[1]);
      }
      Support.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Support Request deleted successfully",
          });
        })
        .catch((err) => {
          res.status(403).json({
            error: err,
          });
        });
    });
};
