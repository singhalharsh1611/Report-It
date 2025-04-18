import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import dotenv from "dotenv";
dotenv.config();
import validator from "validator";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
    const { name, email, password, role, secretKey, aadharCard, panCard } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    if (role === 'admin') {
        if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({
                message: "Unauthorized: Invalid secret key",
                success: false
            });
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            message: "User already exists",
            success: false
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'citizen',
        isVerified: (role === 'moderator') ? false : true,
        aadharCard: (role === 'moderator') ? aadharCard : undefined,
        panCard: (role === 'moderator') ? panCard : undefined

    });
    try {
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
        });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "invalid Credentials",
            success: false
        });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
        return res.status(400).json({
            message: "invalid Credentials",
            success: false
        });
    }

    if (user.role === 'moderator' && !user.isVerified) {
        return res.status(403).json({
            message: "Your account is under verification. Please wait for admin approval.",
            success: false
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
    });
};

//forgot password mail sender
const otpStore = {};
export const sendMail = async (req, res) => {
    try {
        // get email from body
        const { email } = req.body;

        // Validate input
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        // User exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // generate and store otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        // Send OTP via nodemailer 
        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.SENDER_GMAIL}`,
                pass: `${process.env.SENDER_PASS}`, // Use App Password
            },
        });

        // Mail options
        const mailOptions = {
            from: `<${process.env.SENDER_GMAIL}>`,
            to: `${email}`,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}`,
            html: `<h3>ThankYou for Visiting ReportIt <br> Your OTP is: <strong>${otp}</strong></h3>`,
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sented:", info.messageId);
        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ success: false, message: "Email failed", error });
    }
};

// update password
export const updatePassword = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Validate input
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Weak password" });
        }

        const stored = otpStore[email];
        // console.log(stored,otp)
        if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        console.log("password update");
        delete otpStore[email]; // clean up used OTP

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, message: "Password updated", token });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ success: false, message: "Email failed", error });
    }
};