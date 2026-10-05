const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");

const submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;

        if (!examId || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid exam submission" });
        }

        const exam = await Exam.findById(examId);

        if (!exam || exam.status !== "published") {
            return res.status(404).json({ message: "Published exam not found" });
        }

        const questions = await Question.find({ examId }).sort({ createdAt: 1 });

        let score = 0;
        let correct = 0;
        let incorrect = 0;
        let skipped = 0;

        questions.forEach((question, index) => {
            const answer = answers[index];

            if (answer === null || answer === undefined || answer === "") {
                skipped++;
                return;
            }

            const selected = Number(answer);

            if (selected === question.correctAnswer) {
                correct++;
                score += Number(question.marks || 1);
            } else {
                incorrect++;
                score -= Number(exam.negativeMarks || 0);
            }
        });

        score = Math.max(0, score);

        const percentage = exam.totalMarks > 0
            ? Number(((score / exam.totalMarks) * 100).toFixed(2))
            : 0;

        const result = await Result.create({
            examId,
            studentId: req.user.id,
            score,
            totalMarks: exam.totalMarks,
            percentage,
            correct,
            incorrect,
            skipped
        });

        res.status(201).json({
            message: "Exam submitted successfully",
            result
        });
    } catch (error) {
        console.error("Submit exam error:", error);
        res.status(500).json({ message: "Failed to submit exam" });
    }
};

const getMyResults = async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.user.id })
            .populate("examId", "title subject totalMarks")
            .sort({ createdAt: -1 });

        res.json({ results });
    } catch (error) {
        console.error("Get student results error:", error);
        res.status(500).json({ message: "Failed to load results" });
    }
};

const getExamResults = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.examId,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const results = await Result.find({ examId: exam._id })
            .populate("studentId", "name email")
            .sort({ score: -1, createdAt: 1 });

        res.json({ exam, results });
    } catch (error) {
        console.error("Get teacher results error:", error);
        res.status(500).json({ message: "Failed to load results" });
    }
};

module.exports = {
    submitExam,
    getMyResults,
    getExamResults
};
