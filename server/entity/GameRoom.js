/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const uuid = require('uuid/v4');

class GameRoom {
  constructor(io, players) {
    this.players = Array.from(players);
    this.io = io;
    this.id = uuid();
    this.setupPlayers();
  }

  setupPlayers() {
    this.players.forEach(player => {
      player.startPlaying();
    })
  }

  getData() {
    return {
      id: this.id,
      players: this.players
    }
  }
}

module.exports = GameRoom;