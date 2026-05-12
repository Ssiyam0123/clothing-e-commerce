import Role from "./role.model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
export const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.json(roles);
});

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin
export const createRole = asyncHandler(async (req, res) => {
  const { name, description, permissions } = req.body;

  const roleExists = await Role.findOne({ name: name.toLowerCase() });
  if (roleExists) {
    res.status(400);
    throw new Error("Role already exists");
  }

  const role = await Role.create({
    name: name.toLowerCase(),
    description,
    permissions: permissions || [],
    isSystem: false,
    isEditable: true
  });

  res.status(201).json(role);
});

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/Admin
export const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  if (!role.isEditable) {
    res.status(403);
    throw new Error("System roles cannot be modified");
  }

  role.name = req.body.name?.toLowerCase() || role.name;
  role.description = req.body.description || role.description;
  role.permissions = req.body.permissions || role.permissions;

  const updatedRole = await role.save();
  res.json(updatedRole);
});

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
export const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  if (role.isSystem) {
    res.status(403);
    throw new Error("System roles cannot be deleted");
  }

  await Role.deleteOne({ _id: role._id });
  res.json({ message: "Role removed" });
});
