import express from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();


router.get('/', getSettings);


router.put('/', requireAuth, admin, upload.fields([
    { name: 'headerLogoLight', maxCount: 1 },
    { name: 'headerLogoDark', maxCount: 1 },
    { name: 'footerLogoLight', maxCount: 1 },
    { name: 'footerLogoDark', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), updateSettings);

export default router;