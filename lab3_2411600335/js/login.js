document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const feedback = document.getElementById("loginFeedback");

  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "dashboard.html";
    return;
  }

  function showFeedback(message, type) {
    feedback.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }

  function checkLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showFeedback("Please enter both username and password.", "danger");
      return;
    }

    const validUsername = "admin";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";
    } else {
      showFeedback("Invalid username or password. Please try again.", "danger");
    }
  }

  loginBtn.addEventListener("click", checkLogin);

  usernameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") checkLogin();
  });

  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") checkLogin();
  });
});
