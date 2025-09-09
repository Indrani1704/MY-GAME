const Game = require("../models/Game");
const { v4: uuidv4 } = require("uuid");

// Create a new game
const createGame = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      if (req.accepts("html")) return res.render("error", { message: "Username is required" });
      return res.status(400).json({ message: "Username is required" });
    }

    const code = uuidv4().slice(0, 6).toUpperCase();

    // 10 minutes in milliseconds
    const TEN_MINUTES = 10 * 60 * 1000;

    const newGame = await Game.create({
      code,
      cards: [],
      players: [{ username, score: 0 }],
      status: "waiting",
      createdAt: Date.now(),
      endsAt: Date.now() + TEN_MINUTES // store game end timestamp
    });

    // Optional: auto-end game after 10 minutes
    setTimeout(async () => {
      const game = await Game.findOne({ code });
      if (game && game.status === "playing") {
        game.status = "ended";
        await game.save();
      }
    }, TEN_MINUTES);

    if (req.accepts("html")) return res.render("game", { game: newGame });
    res.json(newGame);
  } catch (err) {
    console.error("Create Game Error:", err);
    if (req.accepts("html")) return res.render("error", { message: "Failed to create game" });
    res.status(500).json({ message: "Failed to create game" });
  }
};

// Get game state
const getGame = async (req, res) => {
  try {
    const { code } = req.params;
    const game = await Game.findOne({ code });
    if (!game) {
      if (req.accepts("html")) return res.render("error", { message: "Game not found" });
      return res.status(404).json({ message: "Game not found" });
    }

    if (req.accepts("html")) return res.render("game", { game });
    res.json(game);
  } catch (err) {
    if (req.accepts("html")) return res.render("error", { message: err.message });
    res.status(500).json({ message: err.message });
  }
};

// Join a game
const joinGame = async (req, res) => {
  try {
    const { code } = req.params;
    const { username } = req.body;
    if (!username) {
      if (req.accepts("html")) return res.render("error", { message: "Username is required" });
      return res.status(400).json({ message: "Username is required" });
    }

    const game = await Game.findOne({ code });
    if (!game) {
      if (req.accepts("html")) return res.render("error", { message: "Game not found" });
      return res.status(404).json({ message: "Game not found" });
    }

    if (!game.players.some((p) => p.username === username)) {
      game.players.push({ username, score: 0 });
      await game.save();
    }

    if (req.accepts("html")) return res.render("game", { game });
    res.json(game);
  } catch (err) {
    if (req.accepts("html")) return res.render("error", { message: err.message });
    res.status(500).json({ message: err.message });
  }
};

// Quit or logout from a game
const quitGame = async (req, res) => {
  try {
    const { code } = req.params;
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username required" });

    const game = await Game.findOne({ code });
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Remove player from the game
    game.players = game.players.filter(p => p.username !== username);

    // If no players remain, end the game
    if (game.players.length === 0) game.status = "ended";

    await game.save();

    res.json({ message: `${username} has left the game`, game });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createGame, getGame, joinGame, quitGame };
