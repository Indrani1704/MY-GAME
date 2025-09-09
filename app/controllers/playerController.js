const Player = require("../models/Player");

// Register player
const registerPlayer = async (req, res) => {
  try {
    const { username } = req.body;
    let player = await Player.findOne({ username });
    if (!player) {
      player = await Player.create({ username });
    }
    if (req.accepts("html")) return res.render("player", { player });
    res.json(player);
  } catch (err) {
    if (req.accepts("html")) return res.render("error", { message: err.message });
    res.status(500).json({ message: err.message });
  }
};

// Get player stats
const getPlayerStats = async (req, res) => {
  try {
    const { username } = req.params;
    const player = await Player.findOne({ username });
    if (!player) {
      if (req.accepts("html")) return res.render("error", { message: "Player not found" });
      return res.status(404).json({ message: "Player not found" });
    }
    if (req.accepts("html")) return res.render("player", { player });
    res.json(player);
  } catch (err) {
    if (req.accepts("html")) return res.render("error", { message: err.message });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerPlayer, getPlayerStats };
