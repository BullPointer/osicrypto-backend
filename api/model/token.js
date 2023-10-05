const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 },
});

module.exports = mongoose.model("Token", tokenSchema);
