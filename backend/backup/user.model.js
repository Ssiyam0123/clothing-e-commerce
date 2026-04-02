import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ⚠️ ID Synchronization: Better Auth er String ID ke support korar jonno
    _id: { type: String }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: "" },      // Social login er chobi
    avatar: { type: String, default: "" },     // Manual upload chobi
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    addresses: { type: Array, default: [] }
  },
  { 
    timestamps: true, 
    collection: "users", // 👈 Force 'users' collection
    _id: false          // 👈 Better Auth er pathano ID amra use korbo
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);