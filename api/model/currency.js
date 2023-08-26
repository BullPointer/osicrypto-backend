const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  link: { type: String },
  coin: { type: String },
});

module.exports = mongoose.model("Currency", currencySchema);
