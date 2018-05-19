/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const uuid = require('uuid/v4');

class Player {
  constructor(username) {
    this.id = uuid();
    this.username = username;
    this.socket = null;
    this.status = 'PENDING';
    this.team = null;
  }

  startPlaying() {
    this.status = 'PLAYING'
  }

  setSocket(socket) {
    this.socket = socket;
  }
}

module.exports = Player;