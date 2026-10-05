require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "SmartExam API is working!" });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`SmartExam running at http://localhost:${PORT}`);
});
