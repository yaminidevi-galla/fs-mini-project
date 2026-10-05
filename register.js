const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        message.textContent = "Please fill all fields";
        return;
    }

    message.textContent = "Creating account...";

    try {
        const data = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        });

        message.textContent = data.message;

        setTimeout(() => {
            window.location.href = "/login.html";
        }, 700);
    } catch (error) {
        message.textContent = error.message;
    }
});
