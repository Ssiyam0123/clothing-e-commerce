import express from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';

const router = express.Router();


router.get('/', getSettings);


router.put('/', requireAuth, admin, updateSettings);

export default router;