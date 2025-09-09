const express = require("express");
const { createGame, getGame, joinGame } = require("../controllers/gameController");

const router = express.Router();

// POST /games → create new game
router.post("/games", createGame);

// GET /games/:code → get game state
router.get("/games/:code", getGame);

// POST /games/:code/join → join existing game
router.post("/games/:code/join", joinGame);

module.exports = router;
