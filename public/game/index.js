window.Game = (function () {
  const helpers = window.DOM_Helpers;
  let player = null;

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
    startGame();
  }

  function socketListeners() {
    socket.on('start:game', data => console.log(data));
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
