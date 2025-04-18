import express from "express";
import { login, register, sendMail, updatePassword } from "../controllers/authControllers.js";
import passport from "passport";
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

// Auth with Google
authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    if (req.user) {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Redirect with token in query param
        res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
    } else {
        res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
});

authRouter.post('/forgot-password', sendMail);
authRouter.post('/update-password', updatePassword);

export default authRouter;