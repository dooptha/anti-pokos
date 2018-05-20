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
    flashlight();
  }

  function socketListeners() {
    socket.on('console:message', message => logger.message(message));
    socket.on('start:game', data => {
      window.gameId = data.id;
      const waiting_blocker = document.getElementById( 'waiting-blocker' );
      const blocker = document.getElementById( 'blocker' );
      helpers.hideHTML(waiting_blocker);
      helpers.showHTML(blocker);
      startGame(data);
    });
    socket.on('player:updated', data => updatePlayers(data));
    socket.on('join:room', data => socket.emit('join:room', data));
    socket.on('light:toggle', data => updateLight(data));
    // socket.on('console:message', message => logger.message(message));
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

  function flashlight() {
    let isWorking = true;
    let clicks = 0;
    const message = document.getElementById('action-message');
    const TIMEOUT = 1500;

    setTimeout(offFlashLight, TIMEOUT);

    document.addEventListener('keyup', e => {
        if (e.keyCode === 34 || e.keyCode === 39) {
          clicks--;
        }
        if (clicks <= 0) {
          isWorking = true;
          helpers.hideHTML(message);
          setTimeout(offFlashLight, TIMEOUT)
        }
      }
    );

    function offFlashLight() {
      isWorking = false;
      helpers.showHTML(message);
      clicks = 7;
    }
  }

  return {load, logger};
})();
