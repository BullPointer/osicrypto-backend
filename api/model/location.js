const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  vid: { type: String, trim: true, required: true },
  ip: { type: String, trim: true },
  city: { type: String, trim: true },
  region: { type: String, trim: true },
  country: { type: String, trim: true },
  loc: { type: String, trim: true },
  org: { type: String, trim: true },
  timezone: { type: String, trim: true },
  visits: { type: Number, trim: true, default: 1 },
});

module.exports = mongoose.model("Location", locationSchema);
