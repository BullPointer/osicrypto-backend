const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  notes: { type: String, trim: true },
  author: { type: String, trim: true },
  date: { type: String, default: Date.now() },
  category: { type: String, trim: true },
  status: { type: Boolean, default: true },
  blogImage: { type: String },
});

module.exports = mongoose.model("Blog", blogSchema);
