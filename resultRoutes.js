const express = require("express");
const {
    submitExam,
    getMyResults,
    getExamResults
} = require("../controllers/resultController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", protect, authorize("student"), submitExam);
router.get("/mine", protect, authorize("student"), getMyResults);
router.get("/exam/:examId", protect, authorize("teacher", "admin"), getExamResults);

module.exports = router;
