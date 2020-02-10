const loginHtml = `<div class="login-header"></div>
<div class="login-icon"></div>
<div>
  <div class="login-label">username</div>
  <input type="text" class="login-label-value" id="username" />
  <div class="login-label">password</div>
  <input type="password" class="login-label-value" id="password" />
  <button class="login-button" onclick="checkAndSend('login')">
    Login
  </button>
</div>
<footer class="login-footer">
  Need an account? click <button onclick = "showSignUp()">SignUp</button>
</footer>`;

const signupHtml = `<div class="login-header"></div>
<div class="login-icon"></div>
<div>
  <div class="login-label">username</div>
  <input type="text" class="login-label-value" id="username" />
  <div class="login-label">password</div>
  <input type="password" class="login-label-value" id="password" />
  <div class="login-label">re enter password</div>
  <input
    type="password"
    class="login-label-value"
    id="re-enter-password"
  />
  <button class="sign-up-button" onclick="checkAndSend('signup')">
    Signup
  </button>
</div>
<footer class="login-footer">
  Already SignUp? click<button onclick = "showLogin()">Login</button>
</footer>`;
