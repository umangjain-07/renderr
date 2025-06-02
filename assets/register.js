document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      fullname: registerForm.fullname.value,
      username: registerForm.username.value,
      email: registerForm.email.value,
      password: registerForm.password.value,
    };
const res = await fetch("http://10.0.2.2:5000/register", {  // <- updated IP

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log(result);
  });
});
