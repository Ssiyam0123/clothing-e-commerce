import express from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();


router.get('/', getSettings);


router.put('/', requireAuth, admin, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'logoDark', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), updateSettings);

export default router;