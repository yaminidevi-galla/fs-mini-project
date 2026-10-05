const user = getUser();

if (!requireLogin() || !user || !["teacher", "admin"].includes(user.role)) {
    window.location.href = "/login.html";
}

document.getElementById("teacherName").textContent = user.name;
document.getElementById("welcomeName").textContent = user.name;

document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("createExamForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("examMessage");
    message.textContent = "Creating exam...";

    const payload = {
        title: document.getElementById("title").value.trim(),
        subject: document.getElementById("subject").value,
        description: document.getElementById("description").value.trim(),
        duration: Number(document.getElementById("duration").value),
        totalMarks: Number(document.getElementById("totalMarks").value),
        negativeMarks: Number(document.getElementById("negativeMarks").value || 0)
    };

    if (!payload.title || !payload.subject || !payload.description ||
        !payload.duration || !payload.totalMarks) {
        message.textContent = "Please fill all required fields.";
        return;
    }

    try {
        const data = await apiFetch("/api/exams", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        message.textContent = data.message;

        document.getElementById("createExamForm").reset();
        document.getElementById("duration").value = 60;
        document.getElementById("totalMarks").value = 10;
        document.getElementById("negativeMarks").value = 0;

        setTimeout(() => {
            window.location.href = `/add-questions.html?examId=${data.exam._id}`;
        }, 700);
    } catch (error) {
        message.textContent = error.message;
    }
});
