// ==========================================
// TEACHER RESULTS
// ==========================================

if (!requireLogin()) {
    throw new Error("Login required");
}


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");
const examList = document.getElementById("examList");

const resultsPanel = document.getElementById("resultsPanel");
const resultTitle = document.getElementById("resultTitle");
const resultsTable = document.getElementById("resultsTable");


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}


// ==========================================
// LOAD TEACHER'S EXAMS
// ==========================================

async function loadExams() {

    try {

        examList.innerHTML = `
            <div class="panel">
                <p>Loading your exams...</p>
            </div>
        `;


        const data = await apiFetch("/api/exams/mine");


        console.log("Teacher exams:", data);


        if (!data.exams || data.exams.length === 0) {

            examList.innerHTML = `
                <div class="panel">

                    <h3>No Exams Found</h3>

                    <p>
                        You have not created any exams yet.
                    </p>

                </div>
            `;

            return;
        }


        examList.innerHTML = data.exams.map(exam => `

            <div class="exam-card">

                <h3>
                    ${escapeHtml(exam.title)}
                </h3>

                <p>
                    ${escapeHtml(exam.subject || "No subject")}
                </p>

                <div class="exam-meta">

                    <span class="badge">
                        ${exam.duration} min
                    </span>

                    <span class="badge">
                        ${exam.totalMarks} marks
                    </span>

                    <span class="badge">
                        ${escapeHtml(exam.status || "draft")}
                    </span>

                </div>


                <button
                    class="btn"
                    onclick="viewResults('${exam._id}')"
                >
                    View Results
                </button>

            </div>

        `).join("");


    } catch (error) {

        console.error(
            "Load teacher exams error:",
            error
        );


        examList.innerHTML = `
            <div class="panel">

                <h3>Unable to load exams</h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>
        `;
    }
}


// ==========================================
// VIEW RESULTS FOR ONE EXAM
// ==========================================

async function viewResults(examId) {

    try {

        console.log(
            "Loading results for exam:",
            examId
        );


        // Show result panel
        resultsPanel.classList.remove("hidden");


        // Loading message
        resultTitle.textContent = "Loading Results...";

        resultsTable.innerHTML = `
            <div class="panel">

                <p>
                    Loading student results...
                </p>

            </div>
        `;


        // Request results from backend
        const data = await apiFetch(
            `/api/results/exam/${examId}`
        );


        console.log(
            "Exam results:",
            data
        );


        // Set title
        if (data.exam) {

            resultTitle.textContent =
                `${data.exam.title} - Results`;

        } else {

            resultTitle.textContent =
                "Exam Results";
        }


        // No results
        if (
            !data.results ||
            data.results.length === 0
        ) {

            resultsTable.innerHTML = `
                <div class="panel">

                    <h3>No Student Results Yet</h3>

                    <p>
                        No students have submitted this exam yet.
                    </p>

                </div>
            `;

            return;
        }


        // Display results
        resultsTable.innerHTML = `

            <div class="results-table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Student</th>

                            <th>Email</th>

                            <th>Score</th>

                            <th>Percentage</th>

                            <th>Correct</th>

                            <th>Incorrect</th>

                            <th>Skipped</th>

                            <th>Date</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${data.results.map(result => {

                            const studentName =
                                result.studentId?.name ||
                                "Unknown Student";

                            const studentEmail =
                                result.studentId?.email ||
                                "—";

                            const score =
                                result.score ?? 0;

                            const totalMarks =
                                result.totalMarks ?? 0;

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
                                            ${escapeHtml(
                                                studentName
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            studentEmail
                                        )}
                                    </td>

                                    <td>
                                        ${score}/${totalMarks}
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


        // Scroll to results
        resultsPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "View results error:",
            error
        );


        resultsTable.innerHTML = `
            <div class="panel">

                <h3>Unable to load results</h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="btn"
                    onclick="viewResults('${examId}')"
                >
                    Try Again
                </button>

            </div>
        `;
    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

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


// ==========================================
// START
// ==========================================

loadExams();