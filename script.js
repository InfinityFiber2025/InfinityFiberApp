document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();

      if (usuario && senha) {
        window.location.href = "dashboard.html";
      } else {
        alert("Preencha usuário e senha.");
      }
    });
  }
});

function logout() {
  window.location.href = "index.html";
}

function voltarDashboard() {
  window.location.href = "dashboard.html";
}