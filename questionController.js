const Exam = require("../models/Exam");
const Question = require("../models/Question");

const addQuestion = async (req, res) => {
    try {
        const {
            examId,
            questionText,
            options,
            correctAnswer,
            marks
        } = req.body;

        if (
            !examId ||
            !questionText ||
            !Array.isArray(options) ||
            options.length !== 4 ||
            correctAnswer === undefined
        ) {
            return res.status(400).json({
                message: "Please provide question text, exactly 4 options and the correct answer"
            });
        }

        const exam = await Exam.findOne({
            _id: examId,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found or access denied" });
        }

        const question = await Question.create({
            examId,
            questionText: questionText.trim(),
            options: options.map(o => String(o).trim()),
            correctAnswer: Number(correctAnswer),
            marks: Number(marks || 1)
        });

        res.status(201).json({
            message: "Question added successfully",
            question
        });
    } catch (error) {
        console.error("Add question error:", error);
        res.status(500).json({ message: error.message || "Failed to add question" });
    }
};

const getQuestionsForTeacher = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.examId,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const questions = await Question.find({ examId: exam._id })
            .sort({ createdAt: 1 });

        res.json({ questions });
    } catch (error) {
        console.error("Get questions error:", error);
        res.status(500).json({ message: "Failed to load questions" });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const exam = await Exam.findOne({
            _id: question.examId,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(403).json({ message: "Access denied" });
        }

        await Question.findByIdAndDelete(question._id);

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Delete question error:", error);
        res.status(500).json({ message: "Failed to delete question" });
    }
};

module.exports = {
    addQuestion,
    getQuestionsForTeacher,
    deleteQuestion
};
