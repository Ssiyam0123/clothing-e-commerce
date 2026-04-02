import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  uploadAvatar,
} from './user.controller.js';
import { protect, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { updateUserSchema } from './validators/user.validator.js';

const router = express.Router();


router.route('/profile')
  .put(protect, upload.single('avatar'), updateProfile);

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);


router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, upload.single('avatar'), validate(updateUserSchema), updateUser)
  .delete(protect, admin, deleteUser);

export default router;