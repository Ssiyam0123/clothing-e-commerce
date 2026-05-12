import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Flattened permissions: e.g., ["products:read", "products:create"]
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
    isEditable: {
      type: Boolean,
      default: true, // SuperAdmin role might not be editable
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;
