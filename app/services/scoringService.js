const updateScore = (game, username) => {
  const player = game.players.find(p => p.username === username);
  if(player) player.score += 10;
};

module.exports = { updateScore };
