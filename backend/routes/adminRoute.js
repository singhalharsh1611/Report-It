import express from "express";
 import { changeAdminPassword, login, register } from "../controllers/authControllers.js";
 
 const adminRouter = express.Router();
 
 adminRouter.post('/signup', register);
 adminRouter.post('/login', login);
 adminRouter.patch("/change-password", changeAdminPassword);
 
 export default adminRouter;