const fs = require("fs");
const path = require("path");

exports.delete_uploaded_image = async (image_name) => {
  fs.unlink(path.join(__dirname, "../..", "uploads", image_name), (err) => {
    if (err) return err;
  });
};
