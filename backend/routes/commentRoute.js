import express from "express";
 import { authMiddleware } from "../middleware/authMiddleware.js";
 import { addComment, deleteComments, getComments } from "../controllers/commentController.js";
import { authorizeroles } from "../middleware/rolesMiddleware.js";
 
 const commentRouter = express.Router({mergeParams:true});
 
 commentRouter.post('/', authMiddleware, addComment);
 commentRouter.get('/', getComments);
 commentRouter.delete('/:id_comment',authMiddleware,authorizeroles("admin"), deleteComments);
 
 export default commentRouter;