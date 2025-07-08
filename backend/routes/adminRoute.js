import express from "express";
 import { changeAdminPassword, login, register } from "../controllers/authControllers.js";
 import User from "../models/usersModel.js";
 import Issue from "../models/issueModel.js";
 const adminRouter = express.Router();
 
 adminRouter.post('/signup', register);
 adminRouter.post('/login', login);
 adminRouter.patch("/change-password", changeAdminPassword);
 adminRouter.get("/moderators", async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" });
    res.status(200).json(moderators);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ message: "Server error" });
  }
});
adminRouter.get("/issues", async (req, res) => {
    try {
    const issues = await Issue.find();
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Server error" });
  }
});
adminRouter.get("/stats", async (req, res) => {
    try {
    // Total moderators count
    const totalModerators = await User.countDocuments({ role: "moderator" });

    // Pending moderators (e.g., not verified)
    const pendingModerators = await User.countDocuments({
      role: "moderator",
      isVerified: false,
    });

    // Total issues count
    const totalIssues = await Issue.countDocuments();

    // Completed issues count
    const completedIssues = await Issue.countDocuments({ status: "resolved" });

    const rejectedIssues = await Issue.countDocuments({ status: "rejected" });

    const pendingStatuses = ["open", "in progress", "under review"];
    const pendingIssues = await Issue.countDocuments({ status: { $in: pendingStatuses } });

    res.status(200).json({
      totalModerators,
      pendingModerators,
      totalIssues,
      completedIssues,
      rejectedIssues,
      pendingIssues,
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 
 export default adminRouter;