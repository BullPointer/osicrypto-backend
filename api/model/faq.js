const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: { type: String, trim: true, required: true },
  type: { type: String, trim: true, required: true },
  answer: { type: String, trim: true, required: true },
  status: { type: Boolean, default: true },
  date: { type: String, default: Date.now() },
});

module.exports = mongoose.model("Faq", faqSchema);
