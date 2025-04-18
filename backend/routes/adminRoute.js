import express from "express";
 import { login, register } from "../controllers/authControllers.js";
 
 const adminRouter = express.Router();
 
 adminRouter.post('/signup', register);
 adminRouter.post('/login', login);
 
 export default adminRouter;