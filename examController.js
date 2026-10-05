const Exam = require("../models/Exam");
const Question = require("../models/Question");

const createExam = async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            duration,
            totalMarks,
            negativeMarks
        } = req.body;

        if (!title || !subject || !description || !duration || !totalMarks) {
            return res.status(400).json({ message: "Please fill all required exam fields" });
        }

        const exam = await Exam.create({
            title: title.trim(),
            subject: subject.trim(),
            description: description.trim(),
            duration: Number(duration),
            totalMarks: Number(totalMarks),
            negativeMarks: Number(negativeMarks || 0),
            createdBy: req.user.id,
            status: "draft"
        });

        res.status(201).json({
            message: "Exam created successfully",
            exam
        });
    } catch (error) {
        console.error("Create exam error:", error);
        res.status(500).json({ message: error.message || "Failed to create exam" });
    }
};

const getMyExams = async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ exams });
    } catch (error) {
        console.error("Get my exams error:", error);
        res.status(500).json({ message: "Failed to load exams" });
    }
};

const getPublishedExams = async (req, res) => {
    try {
        const exams = await Exam.find({ status: "published" })
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json({ exams });
    } catch (error) {
        console.error("Get published exams error:", error);
        res.status(500).json({ message: "Failed to load exams" });
    }
};

const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate("createdBy", "name");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const questions = await Question.find({ examId: exam._id })
            .select("-correctAnswer");

        res.json({ exam, questions });
    } catch (error) {
        console.error("Get exam error:", error);
        res.status(500).json({ message: "Failed to load exam" });
    }
};

const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const allowed = [
            "title",
            "subject",
            "description",
            "duration",
            "totalMarks",
            "negativeMarks",
            "status"
        ];

        allowed.forEach(field => {
            if (req.body[field] !== undefined) {
                exam[field] = req.body[field];
            }
        });

        await exam.save();

        res.json({ message: "Exam updated successfully", exam });
    } catch (error) {
        console.error("Update exam error:", error);
        res.status(500).json({ message: "Failed to update exam" });
    }
};

const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        await Question.deleteMany({ examId: exam._id });

        res.json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Delete exam error:", error);
        res.status(500).json({ message: "Failed to delete exam" });
    }
};

const publishExam = async (req, res) => {
    try {
        const exam = await Exam.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { status: "published" },
            { new: true }
        );

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.json({ message: "Exam published successfully", exam });
    } catch (error) {
        console.error("Publish exam error:", error);
        res.status(500).json({ message: "Failed to publish exam" });
    }
};

module.exports = {
    createExam,
    getMyExams,
    getPublishedExams,
    getExamById,
    updateExam,
    deleteExam,
    publishExam
};
