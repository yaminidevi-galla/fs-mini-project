if (!requireLogin()) {
    throw new Error("Login required");
}

const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");

if (!examId) {
    document.getElementById("message").textContent =
        "Exam ID is missing.";
} else {
    loadExam();
    loadQuestions();
}


// ================= ADD QUESTION =================

document.getElementById("questionForm").addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const message =
            document.getElementById("message");

        message.textContent =
            "Adding question...";

        try {

            const data = await apiFetch(
                "/api/questions",
                {
                    method: "POST",

                    body: JSON.stringify({
                        examId: examId,

                        questionText:
                            document
                                .getElementById("questionText")
                                .value
                                .trim(),

                        options: [
                            document
                                .getElementById("option0")
                                .value
                                .trim(),

                            document
                                .getElementById("option1")
                                .value
                                .trim(),

                            document
                                .getElementById("option2")
                                .value
                                .trim(),

                            document
                                .getElementById("option3")
                                .value
                                .trim()
                        ],

                        correctAnswer:
                            Number(
                                document
                                    .getElementById("correctAnswer")
                                    .value
                            ),

                        marks:
                            Number(
                                document
                                    .getElementById("marks")
                                    .value || 1
                            )
                    })
                }
            );

            message.textContent =
                data.message;

            document
                .getElementById("questionForm")
                .reset();

            document
                .getElementById("marks")
                .value = 1;

            loadQuestions();

        } catch (error) {

            console.error(error);

            message.textContent =
                error.message;
        }
    }
);


// ================= LOAD EXAM =================

async function loadExam() {

    try {

        const data =
            await apiFetch(
                `/api/exams/${examId}`
            );

        document
            .getElementById("examTitle")
            .textContent =
            `Questions: ${data.exam.title}`;

        document
            .getElementById("examInfo")
            .textContent =
            `${data.exam.subject} • ${data.questions.length} question(s)`;

    } catch (error) {

        document
            .getElementById("message")
            .textContent =
            error.message;
    }
}


// ================= LOAD QUESTIONS =================

async function loadQuestions() {

    try {

        const data =
            await apiFetch(
                `/api/questions/exam/${examId}`
            );

        const list =
            document.getElementById("questionList");

        if (!data.questions.length) {

            list.innerHTML =
                "<p class='muted'>No questions added yet.</p>";

            return;
        }

        list.innerHTML =
            data.questions.map((q, i) => `

                <div class="question-card">

                    <b>
                        Q${i + 1}.
                        ${escapeHtml(q.questionText)}
                    </b>

                    <p>
                        A. ${escapeHtml(q.options[0])}
                    </p>

                    <p>
                        B. ${escapeHtml(q.options[1])}
                    </p>

                    <p>
                        C. ${escapeHtml(q.options[2])}
                    </p>

                    <p>
                        D. ${escapeHtml(q.options[3])}
                    </p>

                    <span class="badge">
                        Correct:
                        ${["A", "B", "C", "D"][q.correctAnswer]}
                    </span>

                    <button
                        class="btn outline"
                        onclick="deleteQuestion('${q._id}')">
                        Delete
                    </button>

                </div>

            `).join("");

    } catch (error) {

        document
            .getElementById("message")
            .textContent =
            error.message;
    }
}


// ================= DELETE QUESTION =================

async function deleteQuestion(id) {

    try {

        await apiFetch(
            `/api/questions/${id}`,
            {
                method: "DELETE"
            }
        );

        loadQuestions();

    } catch (error) {

        document
            .getElementById("message")
            .textContent =
            error.message;
    }
}


// ================= PUBLISH EXAM =================

const publishExamBtn =
    document.getElementById("publishExamBtn");

if (publishExamBtn) {

    publishExamBtn.addEventListener(
        "click",
        async () => {

            if (!examId) {

                document
                    .getElementById("publishMessage")
                    .textContent =
                    "Exam ID not found.";

                return;
            }

            const confirmPublish =
                confirm(
                    "Are you sure you want to publish this exam?"
                );

            if (!confirmPublish) {
                return;
            }

            const message =
                document.getElementById(
                    "publishMessage"
                );

            try {

                message.textContent =
                    "Publishing exam...";

                const data =
                    await apiFetch(
                        `/api/exams/${examId}/publish`,
                        {
                            method: "PUT"
                        }
                    );

                message.textContent =
                    data.message;

                setTimeout(() => {

                    window.location.href =
                        "/my-exams.html";

                }, 1000);

            } catch (error) {

                console.error(error);

                message.textContent =
                    error.message ||
                    "Unable to publish exam.";
            }
        }
    );
}


// ================= HTML SECURITY =================

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[c])
    );
}