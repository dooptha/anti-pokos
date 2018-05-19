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
    socket.on('a', data => console.log(data));
  }

  return {load};
})();
