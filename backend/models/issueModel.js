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
    imageURL: [{ type: String }],
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
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
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["open", "under review", "in progress", "resolved", "rejected"],
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // optional: track who made the change
        }
      }
    ],
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;