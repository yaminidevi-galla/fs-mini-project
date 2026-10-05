const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message");
    message.textContent = "Logging in...";

    try {
        const data = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value
            })
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        message.textContent = "Login successful!";

        setTimeout(() => {
            if (data.user.role === "teacher") {
                window.location.href = "/teacher-dashboard.html";
            } else if (data.user.role === "admin") {
                window.location.href = "/teacher-dashboard.html";
            } else {
                window.location.href = "/student-dashboard.html";
            }
        }, 500);
    } catch (error) {
        message.textContent = error.message;
    }
});
