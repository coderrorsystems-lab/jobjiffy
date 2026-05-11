import { z } from 'zod';

// More flexible phone regex - accepts +91 followed by 10 digits with optional spaces
export const phoneRegex = /^\+91[\s-]?\d{10}$|^\+[1-9]\d{1,14}$/;

export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string()
    .transform(p => p.replace(/\s+/g, '')) // Remove spaces
    .pipe(z.string().regex(/^\+91\d{10}$/, 'Invalid phone number format (use +91 followed by 10 digits)')),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  img: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  location: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional()
});

export const professionalRegisterSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string()
    .transform(p => p.replace(/\s+/g, '')) // Remove spaces
    .pipe(z.string().regex(/^\+91\d{10}$/, 'Invalid phone number format (use +91 followed by 10 digits)')),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  streetAddress: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  collegeName: z.string().optional(),
  department: z.string().optional(),
  yearOfGraduation: z.number().int().min(1900).max(2100).optional(),
  collegeEmail: z.string().email().optional(),
  collegeIdPhoto: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  services: z.array(z.object({
    category: z.string().optional(),
    serviceName: z.string().min(1, 'Service name is required'),
    desc: z.string().optional(),
    price: z.number().positive('Price must be positive')
  })).min(1, 'At least one service required'),
 
  
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['user', 'professional', 'admin'])
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits')
});

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    console.log('[Validation] ✅ Request validated:', { email: validated.email, phone: validated.phone });
    // Replace body with validated and transformed data
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Validation] ❌ Validation failed:', error.errors);
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