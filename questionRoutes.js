const express = require("express");
const {
    addQuestion,
    getQuestionsForTeacher,
    deleteQuestion
} = require("../controllers/questionController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("teacher", "admin"), addQuestion);
router.get("/exam/:examId", protect, authorize("teacher", "admin"), getQuestionsForTeacher);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteQuestion);

module.exports = router;
