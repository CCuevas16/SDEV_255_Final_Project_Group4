function loginUser() {

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (role === "admin" && username === "admin" && password === "123") {
        document.getElementById("loginModal").style.display = "none";
    }
    else if (role === "student" && username === "student" && password === "123") {
        document.getElementById("loginModal").style.display = "none";
    }
    else {
        alert("Invalid credentials.");
    }
}