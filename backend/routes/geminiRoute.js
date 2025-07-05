import express from "express";
import { generateContent } from "../controllers/geminiController.js";

const geminiRouter = express.Router();

geminiRouter.post("/generate", generateContent);

export default geminiRouter;
