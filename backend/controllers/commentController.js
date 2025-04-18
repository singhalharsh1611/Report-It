import Comment from "../models/commentsModel.js";
 import Issue from "../models/issueModel.js";
 
 export const addComment = async (req, res) => {
     try {
         const issueId = req.params.id;
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
 
         const issueId = req.params.id;
         
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