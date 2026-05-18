import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller.js";
import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/rbac.js";

const router = express.Router();

router.route("/")
  .get(protect, authorize("roles:view"), getRoles)
  .post(protect, authorize("roles:create"), createRole);

router.route("/:id")
  .put(protect, authorize("roles:update"), updateRole)
  .patch(protect, authorize("roles:update"), updateRole)
  .delete(protect, authorize("roles:delete"), deleteRole);

export default router;
