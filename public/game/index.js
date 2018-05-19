window.Game = (function () {
  const helpers = window.DOM_Helpers;
  const consoleContainer = document.getElementById('console-container');
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
    socket.on('console:message', message => logger.message(message));
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
