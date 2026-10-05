if (!requireLogin()) {
    throw new Error("Login required");
}

const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");

const examTitle = document.getElementById("examTitle");
const examDescription = document.getElementById("examDescription");
const questionsContainer = document.getElementById("questions");
const examForm = document.getElementById("examForm");
const message = document.getElementById("message");
const timerElement = document.getElementById("timer");

let questions = [];
let timeRemaining = 0;
let timerInterval = null;
let submitted = false;

if (!examId) {
    message.textContent = "Exam ID is missing.";
} else {
    loadExam();
}

async function loadExam() {
    try {
        message.textContent = "Loading exam...";

        const data = await apiFetch(`/api/exams/${examId}`);

        if (!data.exam) {
            throw new Error("Exam not found");
        }

        if (data.exam.status !== "published") {
            throw new Error("This exam is not available.");
        }

        examTitle.textContent = data.exam.title;

        examDescription.textContent =
            `${data.exam.subject} • ${data.exam.totalMarks} marks • ${data.exam.duration} minutes`;

        questions = data.questions || [];

        if (!questions.length) {
            questionsContainer.innerHTML = `
                <div class="panel">
                    <h2>No questions available</h2>
                    <p>The teacher has not added questions to this exam yet.</p>
                </div>
            `;

            return;
        }

        renderQuestions();

        timeRemaining = Number(data.exam.duration) * 60;

        startTimer();

        message.textContent = "";

    } catch (error) {
        console.error("Load exam error:", error);

        message.textContent = error.message;

        questionsContainer.innerHTML = `
            <div class="panel">
                <h2>Unable to load exam</h2>
                <p>${escapeHtml(error.message)}</p>
            </div>
        `;
    }
}

function renderQuestions() {

    questionsContainer.innerHTML = questions.map((question, index) => `

        <div class="panel question-card">

            <h3>
                Question ${index + 1}
            </h3>

            <p>
                <strong>
                    ${escapeHtml(question.questionText)}
                </strong>
            </p>

            <div class="options">

                ${question.options.map((option, optionIndex) => `

                    <label class="option">

                        <input
                            type="radio"
                            name="question-${index}"
                            value="${optionIndex}"
                        >

                        <span>
                            ${String.fromCharCode(65 + optionIndex)}.
                            ${escapeHtml(option)}
                        </span>

                    </label>

                `).join("")}

            </div>

            <p class="muted">
                Marks: ${question.marks || 1}
            </p>

        </div>

    `).join("");
}

function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

        timeRemaining--;

        updateTimer();

        if (timeRemaining <= 0) {

            clearInterval(timerInterval);

            alert("Time is over. Your exam will be submitted automatically.");

            submitExam();

        }

    }, 1000);
}

function updateTimer() {

    const minutes = Math.floor(timeRemaining / 60);

    const seconds = timeRemaining % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

examForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    await submitExam();

});

async function submitExam() {

    if (submitted) {
        return;
    }

    const confirmSubmit = confirm(
        "Are you sure you want to submit the exam?"
    );

    if (!confirmSubmit && timeRemaining > 0) {
        return;
    }

    submitted = true;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const answers = questions.map((question, index) => {

        const selected = document.querySelector(
            `input[name="question-${index}"]:checked`
        );

        return selected ? Number(selected.value) : null;

    });

    try {

        message.textContent = "Submitting exam...";

        const data = await apiFetch(
            "/api/results/submit",
            {
                method: "POST",
                body: JSON.stringify({
                    examId: examId,
                    answers: answers
                })
            }
        );

        message.textContent =
            data.message || "Exam submitted successfully.";

        if (data.result && data.result._id) {

            window.location.href =
                `/result.html?resultId=${data.result._id}`;

        } else {

            window.location.href =
                "/student-dashboard.html";

        }

    } catch (error) {

        console.error("Submit exam error:", error);

        submitted = false;

        message.textContent = error.message;

        if (timeRemaining > 0) {
            startTimer();
        }
    }
}

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