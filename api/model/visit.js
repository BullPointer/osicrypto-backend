const mongoose = require("mongoose");

const WebVisit = mongoose.Schema({
  visitors: { type: Number, trim: true, default: 0 },
  views: { type: Number, trim: true, default: 0 },
});

module.exports = mongoose.model("Visit", WebVisit);
