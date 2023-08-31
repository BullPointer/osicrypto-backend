const mongoose = require("mongoose");

const privacyPolicy = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  notes: { type: String, trim: true },
  date: { type: String, default: Date.now() },
});

module.exports = mongoose.model("PrivacyPolicy", privacyPolicy);
