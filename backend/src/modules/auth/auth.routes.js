import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from '../../lib/auth.js';

const router = express.Router();

// SENIOR FIX: Using RegExp matches everything inside /api/auth cleanly
router.all(/.*/, toNodeHandler(auth));

export default router;