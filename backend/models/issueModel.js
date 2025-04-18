import mongoose from "mongoose";
 
 const issueSchema = new mongoose.Schema(
   {
     title: {
       type: String,
       required: true,
     },
     description: {
       type: String,
       required: true,
     },
     imageURL: { type: String },
     location: {
       latitude: { type: Number, required: true },
       longitude: { type: Number, required: true },
       address: { type: String },
     },
     status: {
       type: String,
       enum: ["open", "under review", "in progress", "resolved", "rejected"],
       default: "open",
     },
     category: {
       type: String,
       enum: [
         "roads",
         "street light",
         "sewage",
         "water",
         "electricity",
         "garbage",
         "others",
       ],
       required: true,
     },
     createdBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
     },
     verifiedBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
     },
     upvotes: {
       type: Number,
       default: 0,
     },
   },
   { timestamps: true }
 );
 
 const Issue = mongoose.model("Issue", issueSchema);
 export default Issue;