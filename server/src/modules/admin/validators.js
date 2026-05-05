import { z } from 'zod';

export const approveRejectSchema = z.object({
  status: z.enum(['approved', 'rejected'])
});

export const blockUserSchema = z.object({
  isActive: z.boolean()
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};