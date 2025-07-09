import User from "../models/usersModel.js";
import Issue from "../models/issueModel.js";

// ✅ GET /admin/me
export const getCurrentAdmin = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
    
// ✅ GET /admin/moderators
export const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" });
    res.status(200).json(moderators);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /admin/issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalModerators = await User.countDocuments({ role: "moderator" });
    const pendingModerators = await User.countDocuments({
      role: "moderator",
      isVerified: false,
    });
    const totalIssues = await Issue.countDocuments();
    const completedIssues = await Issue.countDocuments({ status: "resolved" });
    const rejectedIssues = await Issue.countDocuments({ status: "rejected" });
    const pendingStatuses = ["open", "in progress", "under review"];
    const pendingIssues = await Issue.countDocuments({
      status: { $in: pendingStatuses },
    });

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
};
