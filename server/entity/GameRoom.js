/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const uuid = require('uuid/v4');

class GameRoom {
  constructor(io, players) {
    this.players = Array.from(players);
    this.io = io;
    this.id = uuid();
    this.reimu = [];
    this.kaban = [];
    this.setupPlayers();
  }

  destroyGame() {
    if (this.lightTimer) {
      clearInterval(this.lightTimer);
    }
  }

  removePlayer(id) {
    const player = this.players.filter((player) => {
      return player.id == id;
    });

    if (player.team == 'reimu') {
      this.reimu.splice(this.reimu.indexOf(player));
      if (this.reimu.length <= 0) {
        const data = this.getData();
        data.winner = 'kaban';
        this.io.to(this.id).emit('game:end', data);
      }
    }
  }

  toggleLight(intensivity) {
    this.io.to(this.id).emit('light:toggle', {intensivity});
  }

  startGame() {
    this.light_time = 0;

    this.lightTimer = setInterval(() => {
      this.light_time += 1;
      if (this.light_time > 2) {
        this.light_time = 0;
      }

      if (this.light_time == 2) {
        this.toggleLight(1);
      } else if (this.light_time == 1) {
        this.toggleLight(0);
      }
    }, 250)
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

      if (player.team == 'reimu') {
        console.log(this.reimu);
        this.reimu.push(player);
      }

      if (player.team == 'kaban')
        this.kaban.push(player);

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
