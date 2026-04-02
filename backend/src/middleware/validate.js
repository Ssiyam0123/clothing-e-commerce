import mongoose from 'mongoose';
import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsedBody = schema.parse(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next(error);
  }
};


export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: `Invalid identification sequence: ${id}` });
  }
  next();
};