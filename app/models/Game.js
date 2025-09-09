const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  players: [{ username: String, score: { type: Number, default: 0 } }],
  cards: [{ id: String, value: String, flipped: Boolean, matched: Boolean }],
  status: { type: String, default: "waiting" },
  winner: { type: String, default: null },
});

module.exports = mongoose.model("Game", GameSchema);
