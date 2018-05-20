window.Game = (function () {
  const helpers = window.DOM_Helpers;
  window.player = null;

  function load(user) {
    const gameContainer = document.getElementById('game-container');
    const loginContainer = document.getElementById('login-container');
    player = user;
    window.socket = io({
      query: `id=${user.id}`
    });

    helpers.hideHTML(loginContainer);
    helpers.showHTML(gameContainer);

    socketListeners();
  }

  function socketListeners() {
    socket.on('start:game', data => {
      window.gameId = data.id;
      startGame(data);
    });
    socket.on('player:updated', data => updatePlayers(data));
    socket.on('join:room', data => socket.emit('join:room', data));
    socket.on('light:toggle', data => updateLight(data));
    socket.on('player:remove', data => {
      for(let k = 0; k < players[data.id].children.length; k++){
        scene.remove(players[data.id].children[k]);
      }
      scene.remove(players[data.id]);
      delete players[data.id];
    });
    // socket.on('console:message', message => logger.message(message));
  }

  const logger = (function() {
    const container = document.getElementById('console');
    function message(text) {
      const html = `<div class="messages">${text}</div>`;
      const div = document.createElement('div');
      div.outerHTML = html;
      container.appendChild(div);
    }
    return {message}
  })();

  return {load, logger};
})();
