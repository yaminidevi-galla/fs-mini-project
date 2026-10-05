const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. Please login."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select(
            "-password"
        );

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();

    } catch (error) {

        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        if (!roles.includes(req.user.role)) {

            console.log(
                `Access denied. User role: ${req.user.role}. Required: ${roles.join(", ")}`
            );

            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};


module.exports = {
    protect,
    authorize
};