import express from "express";
 import {
   getAllIssues,
   getIssueById,
   updateIssueStatus,
   upvoteIssue,
   deleteIssue,
   createIssue,
 } from "../controllers/issueController.js";
 
 import { authMiddleware } from "../middleware/authMiddleware.js";
 import { authorizeroles } from "../middleware/rolesMiddleware.js";
 
 const issueRouter = express.Router();
 
 issueRouter.post("/", authMiddleware, createIssue);
 issueRouter.get("/", getAllIssues);
 issueRouter.get("/:id", getIssueById);
 issueRouter.patch("/:id/status", authMiddleware,authorizeroles("admin","moderator"), updateIssueStatus);
 issueRouter.patch("/:id/upvote", authMiddleware, upvoteIssue);
 issueRouter.delete("/:id", authMiddleware, deleteIssue);
 
 export default issueRouter;