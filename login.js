const logoutLink = document.querySelector("#logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
}

function loginUser() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const ok =
    (role === "administrator" && username === "admin" && password === "123") ||
    (role === "student" && username === "student" && password === "123");

  if (!ok) {
    alert("Invalid credentials.");
    return;
  }

  localStorage.setItem("role", role);
  document.getElementById("loginModal").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role) {
    document.getElementById("loginModal").style.display = "none";
  }
});