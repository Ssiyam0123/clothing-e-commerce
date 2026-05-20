import logger from '../utils/logger.js';
import { ApiError } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Log error using Winston
  logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`, {
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  // Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate field value: ${field} already exists`;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid secure identification token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Secure identification token has expired';
  }

  // Final sanitized output response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString()
  });
};