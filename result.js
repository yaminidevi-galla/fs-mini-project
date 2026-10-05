if (!requireLogin()) throw new Error("Login required");

const result = JSON.parse(localStorage.getItem("lastResult") || "null");
const box = document.getElementById("resultBox");

if (!result) {
    box.innerHTML = "<p>No result data found.</p>";
} else {
    box.innerHTML = `
        <div class="panel">
            <h2>${result.score}/${result.totalMarks}</h2>
            <p><b>Percentage:</b> ${result.percentage}%</p>
            <p><b>Correct:</b> ${result.correct}</p>
            <p><b>Incorrect:</b> ${result.incorrect}</p>
            <p><b>Skipped:</b> ${result.skipped}</p>
        </div>`;
}
