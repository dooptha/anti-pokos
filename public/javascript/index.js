/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const index = function () {
  const helpers = window.DOM_Helpers;
  const Game = window.Game;

  const loginButton = document.getElementById('login-button');
  const usernameInput = document.getElementById('username');
  let processed = false;

  addFormListeners();

  function addFormListeners() {
    usernameInput.addEventListener('keyup', function (e) {
      e.preventDefault();
      if (e.keyCode === 13)
        loginButton.click();
    });
    loginButton.addEventListener('click', e => sendLoginRequest(e))
  }

  function sendLoginRequest(e) {
    if(processed)
      return;
    processed = true;
    const data = {
      username: usernameInput.value
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