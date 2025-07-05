import cloudinary from "../config/cloudinary.js";
import Issue from "../models/issueModel.js";
import {io} from "../server.js";
import { getIO } from "../config/socket.js"; 

// Create a new issue
export const createIssue = async (req, res) => {

  try {
    const {
      title,
      description,
      location,
      category,
    } = req.body;

    let imageURLs = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploadedImage = await cloudinary.uploader.upload(req.files[i].path, {
          folder: "ReportIt",
          transformation: [
            { width: 400, height: 300, crop: "fill" }
          ]
        });
        imageURLs.push(uploadedImage.secure_url);
      }
    }

    const newForm = {
      title,
      description,
      imageURL: imageURLs,
      location: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        address: location.address,
      },
      category,
      createdBy: req.user._id,
      statusHistory:[{
        status:"open",
        updatedAt: new Date(),
        updatedBy: req.user._id,
      }]
    };
    

    const newIssue = new Issue(newForm);

    await newIssue.save();

    // emit the issue to connected sockets in real time
    const io = getIO();
    io.emit("new-issue", {
      _id: newIssue._id,
      issueId: newIssue.issueId,
      title: newIssue.title,
      description: newIssue.description,
      imageURL: newIssue.imageURL,
      location: newIssue.location,
      category: newIssue.category,
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
      status: newIssue.status,
      createdAt: newIssue.createdAt,

    });
 
  
    

    res.status(201).json({ success: true, message: "New issue Added", issueId: newIssue.issueId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create issue" });
  }
};

// Fetch all issues with optional filters
export const getAllIssues = async (req, res) => {
  try {
    const { status, category, sort } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const sortOptions = sort === "latest" ? { createdAt: -1 } : { upvotes: -1 };

   const issues = await Issue.find(filter)
  .populate("createdBy", "_id name role")
  .sort(sortOptions)
  .populate("statusHistory.updatedBy", "_id name role");

    res.json({ success: true, message: "All Issue fetched With given conditions", issues });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

// Fetch issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "name role email")
      .populate("verifiedBy", "name")
      .populate('statusHistory.updatedBy', 'name role');

    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });
    res.json({ success: true, message: "All Issue fetched With given conditions", issue });
  } catch (err) {
    res.status(500).json({ error: "Failed to get issue" });
  }
};

// Update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    // Update current status
    issue.status = status;
    issue.verifiedBy = req.user._id;
    issue.statusUpdatedAt = new Date(); // optional: if you're still using it

    // Push to status history
    issue.statusHistory.push({
      status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
    });

    await issue.save();

    res.json({ success: true, message: "Status updated", statusHistory: issue.statusHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update issue status" });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const { id:issueId } = req.params;
    const userId = req.user._id; // assuming auth middleware sets req.user
    console.log(issueId);
    // console.log(userId);

    const issue = await Issue.findById(issueId);
    console.log(issue);
    if (!issue) return res.status(404).json({success:false, message: "Issue not found" });
    if (!issue.upvotes) issue.upvotes = [];
    const hasUpvoted = issue.upvotes.some((id) => id.toString() === userId.toString());
    console.log(hasUpvoted);
    if (hasUpvoted) {
      // remove upvote
      issue.upvotes = issue.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // add upvote
      issue.upvotes.push(userId);
    }

    await issue.save();

    return res.status(200).json({
      success:true,
      message: hasUpvoted ? "Upvote removed" : "Upvoted",
      upvotesCount: issue.upvotes.length,
    });
  } catch (error) {
    res.status(500).json({success:false, message: "Server error", error });
  }
};


// Delete an issue
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    if (
      issue.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized to delete this issue" });
    }

    await issue.deleteOne();
    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete issue" });
  }
};