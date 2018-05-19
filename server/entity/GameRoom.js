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
    let teams = ['reimu', 'kaban']

    let positions = [
      [200, 0, 200],
      [200, 0, 300],
      [300, 0, 300]
    ]

    this.players.forEach((player, index) => {
      player.startPlaying();
      player.team = index % 2 == 0 ? teams[0] : teams[1];

      let pos_index = Math.floor(Math.random() * positions.length) + 0;
      player.position = positions[pos_index];
      positions.splice(pos_index, 1);
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
