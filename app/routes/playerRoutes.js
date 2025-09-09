const express = require("express");
const { registerPlayer, getPlayerStats } = require("../controllers/playerController");

const router = express.Router();

// POST /players/register → register a new player
router.post("/register", registerPlayer);

// GET /players/:username → get player stats
router.get("/:username", getPlayerStats);

module.exports = router;
