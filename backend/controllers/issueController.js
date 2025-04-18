import cloudinary from "../config/cloudinary.js";
import Issue from "../models/issueModel.js";

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
    };

    const newIssue = new Issue(newForm);

    await newIssue.save();
    res.status(201).json({ success: true, message: "New issue Added" });
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
      .populate("createdBy", "name role") // make object of name and role of person report issue instead of object id
      .sort(sortOptions);

    res.json({ success: true, message: "All Issue fetched With given conditions", issues });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

// Fetch issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "name role")
      .populate("verifiedBy", "name");

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

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verifiedBy: req.user._id,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Issue not found" });

    res.json({ success: true, message: "status Updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update issue status" });
  }
};

// Upvote an issue
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

    issue.upvotes += 1;
    await issue.save();

    res.json({ success: true, message: "Issue upvoted", upvotes: issue.upvotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote issue" });
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