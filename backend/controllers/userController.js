import User from "../models/usersModel.js";
 
 export const getMe = (req, res) => {
     res.json(req.user);
 };
 
 
 export const getAllUsers = async (req, res) => {
     const users = await User.find({ role: { $in: ['citizen', 'moderator'] } }).select('-password'); //select all users and exclude the password from fetched details
     res.json(users);
 }
 
 export const changeUserRole = async (req, res) => {
     try {
         const userId = req.params.id;
         const { role } = req.body;
 
         const user = await User.findById(userId);
         if (!user) {
             return res.status(400).json({
                 message: "User not found",
                 success: false
             });
         }
 
         user.role = role;
         await user.save();
 
         res.status(200).json({
             message: "User role updated successfully",
             success: true
         });
 
     } catch (error) {
         console.log(error);
         res.status(500).json({
             message: "Server Error",
             success: false
         });
     }
 }
 
 
 export const deleteUser = async (req, res) => {
     try {
         const userId = req.params.id;
 
         const user = await User.findById(userId);
 
         if (!user) {
             return res.status(400).json({
                 message: "User not found",
                 success: false
             });
         }
 
         await user.deleteOne();
         res.status(200).json({
             message: "User deleted successfully",
             success: true
         });
 
     } catch (error) {
         console.log(error);
         res.status(500).json({
             message: "Server Error",
             success: false
         });
     }
 }

 export const verifyModerator = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        if (user.role !== 'moderator') {
            return res.status(400).json({
                message: "User is not a moderator",
                success: false
            });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({
            message: "Moderator verified successfully",
            success: true
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
}