import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 import User from "../models/usersModel.js";
 import dotenv from "dotenv";
 dotenv.config();
 
 export const register = async (req, res) => {
    const { name, email, password, role, secretKey, aadharcard, panCard } = req.body;
 
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
 }