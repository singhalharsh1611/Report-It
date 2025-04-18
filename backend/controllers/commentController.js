import Comment from "../models/commentsModel.js";
 import Issue from "../models/issueModel.js";
 
 export const addComment = async (req, res) => {
     try {
        const issueId = req.params.id_issue;
         const { content } = req.body;
 
         const issue = await Issue.findById(issueId);
 
         //if no issue found
         if (!issue) {
             return res.status(404).json({
                 success: false,
                 messgae: "Issue not found"
             });
         }
 
         // add new comment
         const comment = await Comment.create({
             issue: issueId,
             user: req.user._id,
             content
 
         });
 
         res.status(201).json({
             success: true,
             messgae: "Comment added sucecssfully",
             comment
         });
 
 
 
     } catch (error) {
         console.log(error);
         res.status(500).json({
             success: false,
             messgae: "Server error"
         });
     }
 };
 
 export const getComments = async (req, res) => {
     try {
 
        const issueId = req.params.id_issue;
         
         //get comments of the issue, with user name
         const comments = await Comment.find({ issue: issueId }).populate('user', 'name role').sort({ createdAt: -1 });
 
         res.status(200).json({
             success: true,
             comments
         })
 
     } catch (error) {
         console.log(error);
         res.status(500).json({
             success: false,
             messgae: "Server error"
         });
     }
 }
 export const deleteComments= async (req, res) => {
    try {
        const { id_issue, id_comment } = req.params;
    
        // Check if the issue exists
        const issue = await Issue.findById(id_issue);
        if (!issue) {
          return res.status(404).json({
            success: false,
            message: "Issue not found"
          });
        }
    
        // Check if the comment exists and belongs to the issue
        const comment = await Comment.findOne({ _id: id_comment, issue: id_issue });
        if (!comment) {
          return res.status(404).json({
            success: false,
            message: "Comment not found for this issue"
          });
        }
    
        // Optional: Check if the user is the comment owner or an admin
        if (!comment.user.equals(req.user._id) && req.user.role !== "admin") {
          return res.status(403).json({ success: false, message: "Unauthorized" });
        }
    
        await Comment.findByIdAndDelete(id_comment);
    
        res.status(200).json({
          success: true,
          message: "Comment deleted successfully"
        });
    
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server error"
        });
      }
}


