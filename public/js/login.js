const main = function() {
  document.getElementById('loginBox').innerHTML = loginHtml;
};

const showSignUp = function() {
  document.getElementById('loginBox').innerHTML = signupHtml;
};

const showLogin = function() {
  document.getElementById('loginBox').innerHTML = loginHtml;
};

const checkAndSend = function(type) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  post(`/${type}`, JSON.stringify({ username, password }), callAfterLogin);
};
const callAfterLogin = function(req) {
  window.location.href = 'homePage.html';
};

window.onload = main;
