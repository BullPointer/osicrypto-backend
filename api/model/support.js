const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fromAdmin: { type: Boolean, default: false },
  msg: { type: String, required: false },
  fileImage: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const supportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "PENDING" },
  category: { type: String, required: false },
  subject: { type: String, required: false },
  priority: { type: String, required: false },
  email: { type: String, required: false },
  username: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
  lastUpdated: { type: String, required: false },
  messages: [{ type: messageSchema, required: false }],
});

module.exports = mongoose.model("Support", supportSchema);
