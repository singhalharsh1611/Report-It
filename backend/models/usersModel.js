import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ['citizen', 'moderator', 'admin'],
        default: 'citizen',
    },
    googleId: {
        type: String,
        required: false
    },
    aadharCard: { type: String }, // for moderator
    panCard: { type: String },    // for moderator
    isVerified: { type: Boolean, default: true }, // citizens and admins are verified by default
    hasChangedPassword: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model('User', userSchema);