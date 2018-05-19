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
      startGame(data);
    });
    socket.on('player:updated', data => updatePlayers(data));
    socket.on('join:room', data => socket.emit('join:room', data));
    socket.on('light:toggle', data => updateLight(data));
    // socket.on('console:message', message => logger.message(message));
  }

  const logger = (function() {
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
