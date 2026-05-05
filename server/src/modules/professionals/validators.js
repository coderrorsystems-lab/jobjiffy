import { z } from 'zod';

export const professionalUpdateProfileSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  collegeName: z.string().optional(),
  department: z.string().optional(),
  yearOfGraduation: z.number().int().min(1900).max(2100).optional(),
  collegeEmail: z.string().email().optional(),
  collegeIdPhoto: z.string().url().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional()
});

export const professionalChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
});

export const serviceSchema = z.object({
  category: z.enum(['cleaning', 'beauty', 'repair', 'appliance', 'personalcare', 'other']),
  serviceName: z.string().min(1),
  desc: z.string().optional(),
  price: z.number().positive()
});

export const addServiceSchema = serviceSchema;

export const updateServiceSchema = serviceSchema.partial();

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