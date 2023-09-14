const mongoose = require("mongoose");
const Support = require("../model/support");
const { delete_uploaded_image } = require("../utils/handle-files");

exports.make_chat = async (req, res, next) => {
  const id = req.params.id;
  console.log(req.file);

  try {
    const support = await Support.findOne({ _id: id });
    const newMessage = [
      {
        fromAdmin: req.body.fromAdmin,
        msg: req.body.msg,
        fileImage: req.file?.path,
      },
    ];
    support.messages.push(...newMessage);

    support
      .save()
      .then((data) => {
        return res.status(201).json({
          message: "Chat completed successfully",
          data: data,
          request: {
            type: "GET",
            description: "Get all support requests",
            url: `https://api.osicrypto.com/api/supports/`,
          },
        });
      })
      .catch((err) => {
        if (req.file) {
          delete_uploaded_image(req.file.filename);
        }
        return res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    if (req.file) {
      delete_uploaded_image(req.file.filename);
    }
    res.status(500).json({
      error: err,
    });
  }
};
