import express from "express";
import {
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  toggleUpvote,
  deleteIssue,
  createIssue,
  getIssuebyNanoID,
} from "../controllers/issueController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeroles } from "../middleware/rolesMiddleware.js";
import commentRouter from "./commentRoute.js";
import multer from 'multer';
import cloudinaryStorage from '../config/cloudinaryConfig.js'
const upload = multer({ storage: cloudinaryStorage })

const issueRouter = express.Router();

issueRouter.post("/", authMiddleware, upload.array('images'), createIssue);
issueRouter.get("/", getAllIssues);
issueRouter.get("/:id", getIssueById);
issueRouter.get("/issueId/:id", getIssuebyNanoID);
issueRouter.patch("/:id/status", authMiddleware, authorizeroles("admin", "moderator"), updateIssueStatus);
issueRouter.patch("/:id/upvote", authMiddleware, toggleUpvote);
issueRouter.delete("/:id", authMiddleware, deleteIssue);
issueRouter.use('/:id_issue/comments', commentRouter);

export default issueRouter;