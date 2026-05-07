/**
 * Vanguard Multi-Tenant Context Middleware
 * Extracts brand identity (theme, lang) from headers and attaches to req.context
 */
const contextMiddleware = (req, res, next) => {
  const theme = req.headers['x-vanguard-theme'] || 'executive';

  req.vanguardContext = {
    theme,
    isDevelopment: process.env.NODE_ENV === 'development'
  };

  // Optional: Sanitize headers to prevent injection
  const allowedThemes = ['executive', 'streetwear', 'earth', 'luxury', 'cyber'];
  if (!allowedThemes.includes(req.vanguardContext.theme)) {
    req.vanguardContext.theme = 'executive';
  }

  next();
};

export default contextMiddleware;
