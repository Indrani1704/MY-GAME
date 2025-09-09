// services/cardService.js
const { v4: uuidv4 } = require("uuid");

const generateCards = () => {
  const suits = ["S", "H", "D", "C"]; // Spades, Hearts, Diamonds, Clubs
  const ranks = ["A", "2", "3", "4", "5", "6", "7",
                 "8", "9",  "J", "Q", "K"];

  // Build all 52 PNG card filenames
  const allCards = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      allCards.push(`${rank}${suit}.png`); // e.g. "AS.png"
    });
  });

  // Shuffle and pick 15 unique
  const selected = allCards.sort(() => Math.random() - 0.5).slice(0, 15);

  // Duplicate for pairs
  const pairs = [...selected, ...selected];

  // Shuffle again
  const shuffled = pairs.sort(() => Math.random() - 0.5);

  return shuffled.map(file => ({
    id: uuidv4(),
    value: file, // filename
    matched: false,
    flipped: false,
  }));
};

module.exports = { generateCards };
