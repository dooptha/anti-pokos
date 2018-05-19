/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const ROOMS = {
  PENDING: 'pending:room',
  GAME: 'game:room'
};
const GameRoom = require('./entity/GameRoom');

module.exports = function (io, storage) {
  const pendingQuery = new Map();

  io.on('connection', playerConnected);

  function playerConnected(socket) {
    const id = socket.handshake.query.id;

    const player = storage.get(id);

    if(!player)
      return true;

    player.setSocket(socket.id);

    socket.join(ROOMS.PENDING);
    pendingQuery.set(player.id, player);

    if (pendingQuery.size === 3) {
      startGame();
    }

    socket.on('disconnect', function () {
      pendingQuery.delete(player.id);
      storage.delete(player.id);
    });

    socket.on('join:room', function (roomName) {
      socket.join(roomName);
    });

    function startGame() {
      const players = pendingQuery.values();
      const game = new GameRoom(io, players);
      const data = game.getData();
      pendingQuery.forEach(p => {
        io.to(p.socket).emit('join:room', game.id);
        io.to(p.socket).emit('start:game', data);
        // showLog('Game will start in 5 seconds...', p.socket);
        pendingQuery.delete(p.id);
      });
    }

    function showLog(message, target = socket.id) {
      return io.to(target).emit('console:message', message);
    }
  }
};
