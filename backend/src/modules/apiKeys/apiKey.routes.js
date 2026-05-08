import express from 'express';
import { getApiKeys, updateApiKeys } from './apiKey.controller.js';
import { requireAuth, admin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { updateApiKeysSchema } from './apiKey.validator.js';

const router = express.Router();

router.use(requireAuth, admin); 

router.get('/', getApiKeys);
router.put('/', validate(updateApiKeysSchema), updateApiKeys);

export default router;