const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  link: { type: String },
  coins: { type: String },
});

module.exports = mongoose.model("Blog", currencySchema);
