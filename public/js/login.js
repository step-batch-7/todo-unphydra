const checkAndSend = function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  post('/login', JSON.stringify({ username, password }), callAfterLogin);
};
const callAfterLogin = function(req) {
  window.location.href = 'homePage.html';
};
