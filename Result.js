const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        score: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        percentage: { type: Number, required: true },
        correct: { type: Number, default: 0 },
        incorrect: { type: Number, default: 0 },
        skipped: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
