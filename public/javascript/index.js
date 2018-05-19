/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const index = function () {
  const helpers = window.DOM_Helpers;
  const Game = window.Game;

  const loginButton = document.getElementById('login-button');

  addFormListeners();

  function addFormListeners() {
    loginButton.addEventListener('click', e => sendLoginRequest(e))
  }

  function sendLoginRequest(e) {
    const data = {
      username: document.getElementById('username').value
    };
    helpers._ajaxRequest('POST', '/login', data)
      .then(user => {
        console.log(user);
        Game.load(user);
      });
    e.preventDefault();
  }
};


window.onload = index();