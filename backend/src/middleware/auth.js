import { auth } from '../lib/auth.js';

/**
 * 🔒 Strict Authentication: Only for logged-in users (no guest fallback).
 * Used for admin routes, profile updates, etc.
 */
export const requireAuth = async (req, res, next) => {
    try {
        const sessionData = await auth.api.getSession({ headers: req.headers });

        if (!sessionData || !sessionData.session) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        req.user = { 
            ...sessionData.user, 
            _id: sessionData.user.id 
        };
        req.session = sessionData.session;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Authentication protocol error.' });
    }
};

/**
 * 🛡️ Admin: Checks if user has admin role.
 */
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin clearance required.' });
    }
};

/**
 * 👁️ Optional Authentication: For routes that work with guests (cart, wishlist, orders).
 * If session exists, attach user; otherwise, attach guest ID from header.
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const sessionData = await auth.api.getSession({ headers: req.headers });
        if (sessionData && sessionData.session) {
            req.user = { 
                ...sessionData.user, 
                _id: sessionData.user.id 
            };
            req.session = sessionData.session;
        } else {
            // Guest fallback
            const guestId = req.headers['x-guest-id'];
            if (guestId) {
                req.user = { 
                    id: guestId, 
                    _id: guestId, 
                    role: 'guest',
                    name: 'Guest',
                    email: 'guest@vanguard.os'
                };
            }
        }
        next();
    } catch (error) {
        // Even on error, allow the request to continue as guest (but log)
        console.error('Optional auth error:', error);
        next();
    }
};

// Alias for backward compatibility
export const protect = requireAuth;
export const extractUser = optionalAuth;