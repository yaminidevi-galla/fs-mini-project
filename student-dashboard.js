if (!requireLogin()) {
    throw new Error("Login required");
}

const user = getUser();

const studentName = document.getElementById("studentName");
const welcomeName = document.getElementById("welcomeName");
const logoutBtn = document.getElementById("logoutBtn");

const resultsBtn = document.getElementById("resultsBtn");
const resultsPanel = document.getElementById("resultsPanel");
const resultsList = document.getElementById("resultsList");

const examList = document.getElementById("examList");


// ===============================
// STUDENT INFORMATION
// ===============================

if (studentName) {
    studentName.textContent = user?.name || "Student";
}

if (welcomeName) {
    welcomeName.textContent = user?.name || "Student";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}


// ===============================
// LOAD AVAILABLE EXAMS
// ===============================

async function loadExams() {

    try {

        examList.innerHTML = `
            <div class="panel">
                <p>Loading exams...</p>
            </div>
        `;

        const data = await apiFetch("/api/exams/published");

        if (!data.exams || data.exams.length === 0) {

            examList.innerHTML = `
                <div class="panel">
                    <p>No published exams are available.</p>
                </div>
            `;

            return;
        }

        examList.innerHTML = data.exams.map(exam => `

            <div class="exam-card">

                <h3>${escapeHtml(exam.title)}</h3>

                <p>
                    ${escapeHtml(
                        exam.description || "No description available"
                    )}
                </p>

                <div class="exam-meta">

                    <span class="badge">
                        ${escapeHtml(exam.subject || "Subject")}
                    </span>

                    <span class="badge">
                        ${exam.duration} min
                    </span>

                    <span class="badge">
                        ${exam.totalMarks} marks
                    </span>

                </div>

                <a
                    class="btn"
                    href="/exam.html?examId=${exam._id}"
                >
                    Start Exam
                </a>

            </div>

        `).join("");

    } catch (error) {

        console.error("Load exams error:", error);

        examList.innerHTML = `
            <div class="panel">
                <h3>Unable to load exams</h3>
                <p>${escapeHtml(error.message)}</p>
            </div>
        `;
    }
}


// ===============================
// MY RESULTS BUTTON
// ===============================

if (resultsBtn) {

    resultsBtn.addEventListener("click", async function () {

        // Show results panel
        resultsPanel.classList.remove("hidden");

        // Loading message
        resultsList.innerHTML = `
            <div class="panel">
                <p>Loading your results...</p>
            </div>
        `;

        // Load results
        await loadResults();

        // Scroll to results
        resultsPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


// ===============================
// LOAD STUDENT RESULTS
// ===============================

async function loadResults() {

    try {

        console.log("Loading student results...");

        const data = await apiFetch("/api/results/mine");

        console.log("Results received:", data);


        // Check response
        if (!data || !Array.isArray(data.results)) {

            resultsList.innerHTML = `
                <div class="panel">
                    <h3>Unable to display results</h3>
                    <p>Invalid response received from server.</p>
                </div>
            `;

            return;
        }


        // No results
        if (data.results.length === 0) {

            resultsList.innerHTML = `
                <div class="panel">
                    <h3>No Results Yet</h3>
                    <p>
                        You have not submitted any exam yet.
                    </p>
                </div>
            `;

            return;
        }


        // Display results
        resultsList.innerHTML = `

            <div class="results-table-wrapper">

                <table class="results-table">

                    <thead>

                        <tr>
                            <th>Exam</th>
                            <th>Subject</th>
                            <th>Score</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th>Skipped</th>
                            <th>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${data.results.map(result => {

                            const examTitle =
                                result.examId?.title ||
                                "Unknown Exam";

                            const subject =
                                result.examId?.subject ||
                                "—";

                            const score =
                                result.score ?? 0;

                            const totalMarks =
                                result.totalMarks ??
                                result.examId?.totalMarks ??
                                0;

                            const percentage =
                                result.percentage ?? 0;

                            const correct =
                                result.correct ?? 0;

                            const incorrect =
                                result.incorrect ?? 0;

                            const skipped =
                                result.skipped ?? 0;

                            const date =
                                result.createdAt
                                    ? new Date(
                                        result.createdAt
                                    ).toLocaleString()
                                    : "—";


                            return `

                                <tr>

                                    <td>
                                        <strong>
                                            ${escapeHtml(examTitle)}
                                        </strong>
                                    </td>

                                    <td>
                                        ${escapeHtml(subject)}
                                    </td>

                                    <td>
                                        ${score}
                                    </td>

                                    <td>
                                        ${totalMarks}
                                    </td>

                                    <td>
                                        <strong>
                                            ${percentage}%
                                        </strong>
                                    </td>

                                    <td>
                                        ${correct}
                                    </td>

                                    <td>
                                        ${incorrect}
                                    </td>

                                    <td>
                                        ${skipped}
                                    </td>

                                    <td>
                                        ${escapeHtml(date)}
                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        `;

    } catch (error) {

        console.error(
            "Load results error:",
            error
        );

        resultsList.innerHTML = `

            <div class="panel">

                <h3>Unable to load results</h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="btn"
                    onclick="loadResults()"
                >
                    Try Again
                </button>

            </div>

        `;
    }
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        function(c) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[c];

        }
    );
}


// ===============================
// START DASHBOARD
// ===============================

loadExams();