const Game = require("../models/Game");
const { generateCards } = require("../services/cardService");
const { updateScore } = require("../services/scoringService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("joinGame", async ({ code, username }) => {
      socket.join(code);
      let game = await Game.findOne({ code: code.toUpperCase() });
      if(!game) return;

      if(!game.players.some(p => p.username === username)) {
        game.players.push({ username, score: 0 });
        await game.save();
      }

      io.to(code).emit("playerJoined", { username });
      io.to(code).emit("gameState", game);
    });

    socket.on("startGame", async ({ code }) => {
      const game = await Game.findOne({ code: code.toUpperCase() });
      if(!game || game.status !== "waiting") return;

      game.cards = generateCards();
      game.status = "in-progress";
      await game.save();

      io.to(code).emit("gameState", game);
    });

    socket.on("flipCard", async ({ code, cardId, username }) => {
      const game = await Game.findOne({ code: code.toUpperCase() });
      if(!game || game.status !== "in-progress") return;

      const card = game.cards.find(c => c.id === cardId);
      if(!card || card.flipped || card.matched) return;

      card.flipped = true;
      await game.save();
      io.to(code).emit("gameState", game);

      const flipped = game.cards.filter(c => c.flipped && !c.matched);
      if(flipped.length === 2) {
        const [c1, c2] = flipped;
        if(c1.value === c2.value) {
          c1.matched = c2.matched = true;
          updateScore(game, username);
          await game.save();
          io.to(code).emit("matchFound", { cards: [c1.id, c2.id], player: username });
          io.to(code).emit("gameState", game);
        } else {
          setTimeout(async () => {
            c1.flipped = c2.flipped = false;
            await game.save();
            io.to(code).emit("noMatch", { cards: [c1.id, c2.id] });
            io.to(code).emit("gameState", game);
          }, 1000);
        }
      }

      if(game.cards.every(c => c.matched)) {
        game.status = "finished";
        game.winner = game.players.sort((a,b) => b.score - a.score)[0]?.username;
        await game.save();
        io.to(code).emit("gameOver", { winner: game.winner });
      }
    });

    socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
  });
};
