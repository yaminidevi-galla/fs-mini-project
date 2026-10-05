require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const User = require("./models/User");

const createTeacher = async () => {
    await connectDB();

    const email = "teacher@smartexam.com";
    const password = "Teacher@123";

    const existing = await User.findOne({ email });

    if (existing) {
        existing.role = "teacher";
        await existing.save();
        console.log("Teacher account already exists. Role updated to teacher.");
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name: "SmartExam Teacher",
        email,
        password: hashedPassword,
        role: "teacher"
    });

    console.log("Teacher account created successfully!");
    console.log("Email: teacher@smartexam.com");
    console.log("Password: Teacher@123");
    process.exit(0);
};

createTeacher();
