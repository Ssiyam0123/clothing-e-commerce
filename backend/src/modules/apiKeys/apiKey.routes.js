import express from 'express';
import { getApiKeys, updateApiKeys } from './apiKey.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, admin); 

router.get('/', getApiKeys);
router.put('/', updateApiKeys);

export default router;