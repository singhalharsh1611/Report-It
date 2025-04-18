import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({
        success: false,
        message: "Unauthorized"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();

    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
}