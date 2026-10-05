const express = require("express");
const { register, registerTeacher, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/register-teacher", registerTeacher);
router.post("/login", login);

module.exports = router;
