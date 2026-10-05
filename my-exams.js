if (!requireLogin()) throw new Error("Login required");

document.getElementById("logoutBtn").addEventListener("click", logout);

const examList = document.getElementById("examList");
const message = document.getElementById("message");

async function loadExams() {
    try {
        const data = await apiFetch("/api/exams/mine");

        if (!data.exams.length) {
            examList.innerHTML = `
                <div class="panel">
                    <h2>No exams yet</h2>
                    <p>Create your first exam from the Teacher Dashboard.</p>
                </div>`;
            return;
        }

        examList.innerHTML = data.exams.map(exam => `
            <div class="exam-card">
                <h3>${escapeHtml(exam.title)}</h3>
                <p>${escapeHtml(exam.description)}</p>
                <div class="exam-meta">
                    <span class="badge">${escapeHtml(exam.subject)}</span>
                    <span class="badge">${exam.duration} min</span>
                    <span class="badge">${exam.totalMarks} marks</span>
                    <span class="badge">${exam.status}</span>
                </div>
                <div class="card-actions">
                    <a class="btn" href="/add-questions.html?examId=${exam._id}">Questions</a>
                    <button class="btn outline" onclick="publishExam('${exam._id}')">Publish</button>
                    <button class="btn outline" onclick="deleteExam('${exam._id}')">Delete</button>
                </div>
            </div>
        `).join("");
    } catch (error) {
        message.textContent = error.message;
    }
}

async function publishExam(id) {
    try {
       const data = await apiFetch(
    `/api/exams/${id}/publish`,
    {
        method: "PUT"
    }
);
        message.textContent = data.message;
        loadExams();
    } catch (error) {
        message.textContent = error.message;
    }
}

async function deleteExam(id) {
    if (!confirm("Delete this exam and its questions?")) return;

    try {
        const data = await apiFetch(`/api/exams/${id}`, { method: "DELETE" });
        message.textContent = data.message;
        loadExams();
    } catch (error) {
        message.textContent = error.message;
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
    }[c]));
}

loadExams();
