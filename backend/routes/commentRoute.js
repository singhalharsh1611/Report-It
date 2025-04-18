import express from "express";
 import { authMiddleware } from "../middleware/authMiddleware.js";
 import { addComment, getComments } from "../controllers/commentController.js";
 
 const commentRouter = express.Router({mergeParams:true});
 
 commentRouter.post('/', authMiddleware, addComment);
 commentRouter.get('/', getComments);
 
 export default commentRouter;