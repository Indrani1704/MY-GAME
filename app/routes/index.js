const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const { v4: uuidv4 } = require("uuid");

// Lobby
router.get("/",(req,res)=>res.render("lobby"));

// Create game
router.get("/game/new/:username",async(req,res)=>{
  const username=req.params.username;
  const code=uuidv4().slice(0,6).toUpperCase();
  const game=await Game.create({code,players:[{username,score:0}],cards:[],status:"waiting"});
  res.render("game",{game,username});
});

// Join game
router.get("/game/:code/:username",async(req,res)=>{
  const {code,username}=req.params;
  let game=await Game.findOne({code:code.toUpperCase()});
  if(!game) return res.send("Game not found!");
  if(!game.players.some(p=>p.username===username)){
    game.players.push({username,score:0});
    await game.save();
  }
  res.render("game",{game,username});
});

module.exports = router;
