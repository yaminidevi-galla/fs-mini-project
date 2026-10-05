const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: Number,
            required: true
        },

        totalMarks: {
            type: Number,
            required: true
        },

        negativeMarks: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Exam", examSchema);