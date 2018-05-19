const express = require('express');
const router = express.Router();
const Player = require('../server/entity/Player');
const storage = new Map();

module.exports = function () {

  /* GET home page. */
  router.get('/', function (req, res) {
    return res.render('index', {title: 'anit#pokos'});
  });

  router.post('/login', function (req, res) {
    const username = req.body.username;
    if (!username)
      return res.status(400).send({error: 'Username is required!'});
    const player = new Player(username);
    storage.set(player.id, player);
    return res.status(200).send(player)
  });

  return {
    router,
    storage
  }
};
