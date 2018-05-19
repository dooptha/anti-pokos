window.Game = (function () {
  const helpers = window.DOM_Helpers;
  const log = logger();
  let player = null;

  function load(user) {
    const gameContainer = document.getElementById('game-container');
    const loginContainer = document.getElementById('login-container');
    player = user;
    const socket = io({
      query: `id=${user.id}`
    });

    helpers.hideHTML(loginContainer);
    helpers.showHTML(gameContainer);

    socketListeners(socket);
  }

  function socketListeners(socket) {
    socket.on('start:game', data => console.log(data));

    socket.on('console:message', message => log.message(message));
  }

  return {load};
})();

const logger = function() {
  const container = document.getElementById('console');
  function message(text) {
    const html =
      `<div class="console">
         <div class="messages">${text}</div>
       </div>`;
    const div = document.createElement('div');
    div.outerHTML = html;
    container.appendChild(div);
  }
  return {message}
};