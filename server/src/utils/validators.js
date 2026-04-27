import { z } from 'zod';

export const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format (use +91...)'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional()
});

export const professionalRegisterSchema = userRegisterSchema.extend({
  professionalDetails: z.object({
    category: z.enum(['cleaning', 'beauty', 'repair', 'appliance', 'personalcare', 'other']),
    services: z.array(z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().positive()
    })).min(1, 'At least one service required'),
    experience: z.number().int().min(0),
    bio: z.string().max(500),
    serviceArea: z.object({
      city: z.string(),
      radius: z.number().positive()
    }),
    kycDocuments: z.object({
      aadhar: z.string(),
      pan: z.string(),
      addressProof: z.string()
    }).optional(),
    bankDetails: z.object({
      accountNumber: z.string(),
      ifsc: z.string(),
      accountHolderName: z.string(),
      upiId: z.string().optional()
    }).optional()
  })
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

export const otpRequestSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number format')
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(phoneRegex),
  code: z.string().length(6, 'OTP must be 6 digits')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional(),
  profilePhoto: z.string().url().optional()
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