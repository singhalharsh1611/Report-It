import mongoose from "mongoose";
import { nanoid } from "nanoid";

const issueSchema = new mongoose.Schema(
  { 
    issueId: {
      type: String,
      unique: true,
    },
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
          ref: "User",
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

// to get short issueId
issueSchema.pre("save", async function (next) {
  if (!this.issueId) {
    this.issueId = nanoid(8).toUpperCase(); 
  }
  next();
});


const Issue = mongoose.model("Issue", issueSchema);
export default Issue;