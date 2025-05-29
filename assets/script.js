document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        username: loginForm.username.value,
        password: loginForm.password.value,
      };
      const res = await fetch("http://<YOUR_FLUTTER_BACKEND>/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        fullname: registerForm.fullname.value,
        username: registerForm.username.value,
        email: registerForm.email.value,
        password: registerForm.password.value,
      };
      const res = await fetch("http://<YOUR_FLUTTER_BACKEND>/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
    });
  }
});
