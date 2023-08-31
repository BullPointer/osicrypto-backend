const mongoose = require("mongoose");

const termsAndConditionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  notes: { type: String, trim: true },
  date: { type: String, default: Date.now() },
});

module.exports = mongoose.model("TermAndCondition", termsAndConditionSchema);
