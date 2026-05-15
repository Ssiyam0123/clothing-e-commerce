import express from 'express';
import { sendUnifiedCapiEvent } from '../../services/tracking/multiPlatformCapiService.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      eventName,
      eventData = {},
      userData = {},
      eventId, // 👈 Captured from frontend request
      eventSourceUrl = req.headers.referer || '',
    } = req.body;

    // Extract Facebook cookies from request headers
    const fbp = req.cookies._fbp;
    const fbc = req.cookies._fbc;

    // Extract IP and User Agent for better matching
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Merge user data from the request (authenticated or guest) with cookies
    const finalUserData = {
      ...(req.user?.email && { email: req.user.email }),
      ...(req.user?.phone && { phone: req.user.phone }),
      ...(req.user?.name && { name: req.user.name }),
      ...userData,
      ...(fbp && { fbp }),
      ...(fbc && { fbc }),
      ip,
      userAgent,
    };

    await sendUnifiedCapiEvent({
      eventName,
      eventId, 
      userData: finalUserData,
      customData: eventData,
      eventSourceUrl,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Tracking API error:', error);
    res.status(500).json({ success: false, message: 'Tracking failed' });
  }
});

export default router;