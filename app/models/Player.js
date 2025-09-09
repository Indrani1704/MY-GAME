const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("Player", PlayerSchema);
