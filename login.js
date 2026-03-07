const logoutLink = document.querySelector("#logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
}

async function loginUser() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter a username and password.");
    return;
  }

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, username, password }),
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    alert(msg.error || "Invalid credentials.");
    return;
  }

  const data = await res.json();
  localStorage.setItem("role", data.role);
  document.getElementById("loginModal").style.display = "none";
}

async function createAccount() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter a username and password to create an account.");
    return;
  }

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, username, password }),
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    alert(msg.error || "Could not create account.");
    return;
  }

  const data = await res.json();
  localStorage.setItem("role", data.role);
  document.getElementById("loginModal").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role) {
    document.getElementById("loginModal").style.display = "none";
  }
});