window.Game = (function () {
  const helpers = window.DOM_Helpers;
  const consoleContainer = document.getElementById('console-container');

  function load(user) {
    const gameContainer = document.getElementById('game-container');
    const loginContainer = document.getElementById('login-container');
    window.player = user;
    window.socket = io({
      query: `id=${user.id}`
    });

    helpers.hideHTML(loginContainer);
    helpers.showHTML(gameContainer);

    socketListeners();
  }

  function socketListeners() {
    socket.on('console:message', message => logger.message(message));
    socket.on('start:game', data => {
      window.gameId = data.id;
      const waiting_blocker = document.getElementById('waiting-blocker');
      const blocker = document.getElementById('blocker');
      helpers.hideHTML(waiting_blocker);
      helpers.showHTML(blocker);
      startGame(data);
    });
    socket.on('player:updated', data => updatePlayers(data));
    socket.on('plate:disabled', data => disablePlate(data));
    socket.on('join:room', data => socket.emit('join:room', data));
    socket.on('leave:room', data => socket.emit('leave:room', data));
    socket.on('light:toggle', data => updateLight(data));
    socket.on('player:died', data => playerDied(data));
    socket.on('player:won', data => playerWon(data));
    socket.on('player:remove', data => {
      if (players[data.id]) {
        for (let k = 0; k < players[data.id].children.length; k++) {
          scene.remove(players[data.id].children[k]);
        }
        scene.remove(players[data.id]);
        delete players[data.id];
      }
    });

    socket.on('game:end', data => {
      console.log("asdasd", data);
      helpers.removeElement(document.getElementById('game'));
      if (data.winner == 'kaban') {
        if (window.player.team == 'reimu')
          return playerDied();
        else
          playerWon();
      }
      if (data.winner == 'reimu') {
        if (window.player.team == 'reimu')
          return playerWon();
        else
          playerDied();
      }
      // stop game
      socket.emit('game:ended', data.id);
    });
  }

  function playerDied(data) {
    const container = document.getElementById('dead-wrapper');
    helpers.showHTML(container);
    document.onkeyup = function (e) {
      if (e.keyCode === 32) {
        window.location.reload();
      }
    };
  }

  function playerWon(data) {
    const container = document.getElementById('win-wrapper');
    helpers.showHTML(container);
    document.onkeyup = function (e) {
      if (e.keyCode === 32) {
        window.location.reload();
      }
    };
  }

  const logger = (function () {
    function message(text) {
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = text;
      consoleContainer.appendChild(div);
      setTimeout(function () {
        helpers.removeElement(div);
      }, 4000)
    }

    return {message}
  })();

  return {load, logger};
})();
