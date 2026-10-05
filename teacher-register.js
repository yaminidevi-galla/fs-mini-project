const teacherRegisterForm = document.getElementById("teacherRegisterForm");

teacherRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        message.textContent = "Please fill all required fields";
        return;
    }

    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match";
        return;
    }

    message.textContent = "Creating teacher account...";

    try {
        const data = await apiFetch("/api/auth/register-teacher", {
            method: "POST",
            body: JSON.stringify({ name, email, department, password })
        });

        message.textContent = data.message;
        teacherRegisterForm.reset();

        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1000);
    } catch (error) {
        message.textContent = error.message;
    }
});
