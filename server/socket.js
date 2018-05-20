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
  const playingRooms = new Map();
  const PLAYER_LIMIT = 3;

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

    socket.on('leave:room', function (roomName) {
      socket.leave(roomName);
    });

    socket.on('join:room', function (roomName) {
      socket.join(roomName);
    });

    socket.on('player:destroy', function(response){
      const playerId = response.id;
      const gameRoomId = response.gameId;

      io.to(playerId).emit('leave:room', gameRoomId);
      io.to(gameRoomId).emit('player:remove', { id: playerId });
      const game = playingRooms.get(gameRoomId);
      if(game)
        game.removePlayer(playerId);
    });

    socket.on('game:ended', function (id) {
      const game = playingRooms.get(id);
      if(game){
        game.destroyGame();
        playingRooms.delete(id);
      }
    });

    socket.on('plate:disable', function(response){
      const game = playingRooms.get(response.gameId);
      if(game)
        game.removePlate(response.index);
      io.to(response.gameId).emit('plate:disabled', { index: response.index });
    });

    socket.on('player:update', function(response){
      io.to(response.gameId).emit('player:updated', response.data);
    });

    function startGame() {
      const players = pendingQuery.splice(0, PLAYER_LIMIT);
      const game = new GameRoom(io, players);
      playingRooms.set(game.id, game);
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
