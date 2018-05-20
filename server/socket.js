/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const ROOMS = {
  PENDING: 'pending:room',
  GAME: 'game:room'
};
const GameRoom = require('./entity/GameRoom');

module.exports = function (io, storage) {
  const pendingQuery = [];
  const PLAYER_LIMIT = 2;

  io.on('connection', playerConnected);

  function playerConnected(socket) {
    const id = socket.handshake.query.id;

    const player = storage.get(id);

    if(!player)
      return true;

    player.setSocket(socket.id);

    socket.join(ROOMS.PENDING);
    pendingQuery.push(player);
    const playerNeeded = PLAYER_LIMIT - pendingQuery.length;

    if (playerNeeded <= 0) {
      startGame();
    } else {
      showLog(`Hello, <span class="anon">${player.username}</span>! ${playerNeeded} more players needed`, ROOMS.PENDING);
    }

    socket.on('disconnect', function () {
      pendingQuery.splice(pendingQuery.indexOf(player), 1);
      storage.delete(player.id);
    });

    socket.on('join:room', function (roomName) {
      socket.join(roomName);
    });

    socket.on('player:update', function(response){
      io.to(response.gameId).emit('player:updated', response.data);
    });

    function startGame() {
      const players = pendingQuery.splice(0, PLAYER_LIMIT);
      const game = new GameRoom(io, players);
      const data = game.getData();
      players.forEach(p => {
        io.to(p.socket).emit('join:room', game.id);
        io.to(p.socket).emit('start:game', data);
        showLog('Game will start in 5 seconds...', p.socket);
      });
      game.startGame();
    }

    function showLog(message, target = socket.id) {
      return io.to(target).emit('console:message', message);
    }
  }
};
