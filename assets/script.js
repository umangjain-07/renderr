document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

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
});
