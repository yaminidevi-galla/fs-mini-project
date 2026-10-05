const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },
        questionText: { type: String, required: true, trim: true },
        options: {
            type: [String],
            required: true,
            validate: v => v.length === 4
        },
        correctAnswer: { type: Number, required: true, min: 0, max: 3 },
        marks: { type: Number, default: 1, min: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
