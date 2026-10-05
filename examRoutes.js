const express = require("express");

const {
    createExam,
    getMyExams,
    getPublishedExams,
    getExamById,
    updateExam,
    deleteExam,
    publishExam
} = require("../controllers/examController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("teacher", "admin"),
    createExam
);

router.get(
    "/mine",
    protect,
    authorize("teacher", "admin"),
    getMyExams
);

router.get(
    "/published",
    protect,
    authorize("student"),
    getPublishedExams
);

router.get(
    "/:id",
    protect,
    getExamById
);

router.put(
    "/:id",
    protect,
    authorize("teacher", "admin"),
    updateExam
);

router.delete(
    "/:id",
    protect,
    authorize("teacher", "admin"),
    deleteExam
);

router.put(
    "/:id/publish",
    protect,
    authorize("teacher", "admin"),
    publishExam
);

module.exports = router;