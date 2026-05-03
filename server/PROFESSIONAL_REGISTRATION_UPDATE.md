# Professional Registration Backend Update Guide

## Overview
The frontend has been updated to align with a comprehensive professional registration API schema. This guide provides the required backend changes.

## Updated API Schema

### Request Body (FormData + JSON)
```json
{
  "name": "string (2-100 chars)",
  "email": "valid email string",
  "password": "string (min 8 chars)",
  "phone": "E.164 format like +919999999999",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string (optional)"
  },
  "professionalDetails": {
    "category": "cleaning | beauty | repair | appliance | personalcare | other",
    "services": [
      {
        "name": "string",
        "description": "string",
        "price": "number (positive)"
      }
    ],
    "experience": "number (years)",
    "bio": "string (max 500 chars)",
    "serviceArea": {
      "city": "string",
      "radius": "number (positive, in km)"
    },
    "kycDocuments": {
      "aadhar": "file",
      "pan": "file (optional)",
      "addressProof": "file"
    },
    "bankDetails": {
      "accountNumber": "string",
      "ifsc": "string",
      "accountHolderName": "string",
      "upiId": "string (optional)"
    }
  }
}
```

### Response
```json
{
  "message": "Professional registered successfully. Pending admin approval.",
  "user": {
    "id": "string (uuid/mongo id)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": { ... },
    "professionalDetails": { ... },
    "status": "pending",
    "createdAt": "ISO 8601 timestamp",
    "verificationDetails": {
      "kycStatus": "pending",
      "verifiedAt": null,
      "verifiedBy": null,
      "rejectionReason": null
    }
  }
}
```

## Required Backend Changes

### 1. Update Professional Model/Schema
```javascript
// Example: MongoDB Schema Update
const professionalSchema = new Schema({
  // Basic Info
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true }, // E.164 format
  passwordHash: { type: String, required: true },
  
  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Professional Details
  professionalDetails: {
    category: {
      type: String,
      enum: ['cleaning', 'beauty', 'repair', 'appliance', 'personalcare', 'other'],
      required: true
    },
    services: [{
      name: { type: String, required: true, maxlength: 100 },
      description: { type: String, required: true, maxlength: 300 },
      price: { type: Number, required: true, min: 0 }
    }],
    experience: { type: Number, required: true, min: 0 },
    bio: { type: String, required: true, maxlength: 500 },
    serviceArea: {
      city: { type: String, required: true },
      radius: { type: Number, required: true, min: 1, default: 10 } // in km
    },
    kycDocuments: {
      aadhar: { type: String }, // File path/URL
      pan: { type: String },    // Optional
      addressProof: { type: String } // File path/URL
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
      accountHolderName: { type: String, required: true, maxlength: 100 },
      upiId: { type: String } // Optional
    }
  },
  
  // Status & Verification
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  verificationDetails: {
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    rejectionReason: { type: String }
  },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 2. Setup File Upload Middleware
```javascript
// multer configuration
import multer from 'multer';
import path from 'path';

const UPLOAD_DIR = 'uploads/kyc-documents';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.'));
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error('File size exceeds 5MB limit.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadKYCFiles = upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]);
```

### 3. Update Registration Controller
```javascript
import bcrypt from 'bcryptjs';
import { Professional } from '../models/professional.js';
import { validateEmail, validatePhone, validateIFSC } from '../utils/validators.js';

export const registerProfessional = async (req, res) => {
  try {
    // 1. Parse and validate basic info
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Missing required basic fields' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Phone must be in E.164 format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // 2. Check if user exists
    const existingProfessional = await Professional.findOne({ email: email.toLowerCase() });
    if (existingProfessional) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // 3. Parse nested JSON fields
    let address, professionalDetails;
    try {
      address = JSON.parse(req.body.address);
      professionalDetails = JSON.parse(req.body.professionalDetails);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON format in address or professionalDetails' });
    }

    // 4. Validate address
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    // 5. Validate professional details
    const { category, experience, bio, serviceArea, services, bankDetails } = professionalDetails;

    if (!category || !experience || !bio || !serviceArea?.city) {
      return res.status(400).json({ message: 'Missing required professional details' });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'At least one service is required' });
    }

    // Validate each service
    for (const service of services) {
      if (!service.name || !service.description || service.price === undefined) {
        return res.status(400).json({ message: 'Each service must have name, description, and price' });
      }
      if (typeof service.price !== 'number' || service.price <= 0) {
        return res.status(400).json({ message: 'Service price must be a positive number' });
      }
    }

    // 6. Validate bank details
    if (!bankDetails?.accountNumber || !bankDetails?.ifsc || !bankDetails?.accountHolderName) {
      return res.status(400).json({ message: 'Missing required bank details' });
    }

    if (!validateIFSC(bankDetails.ifsc)) {
      return res.status(400).json({ message: 'Invalid IFSC code format' });
    }

    // 7. Check file uploads
    if (!req.files?.aadhar || !req.files?.addressProof) {
      return res.status(400).json({ message: 'Aadhar and address proof documents are required' });
    }

    // 8. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 9. Create professional record
    const professional = new Professional({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: hashedPassword,
      address,
      professionalDetails: {
        ...professionalDetails,
        kycDocuments: {
          aadhar: req.files.aadhar[0].path,
          pan: req.files.pan?.[0]?.path || null,
          addressProof: req.files.addressProof[0].path
        }
      },
      status: 'pending',
      verificationDetails: {
        kycStatus: 'pending'
      }
    });

    await professional.save();

    // 10. Send verification email to admin/support
    // await sendAdminNotification(professional);

    // 11. Return response
    return res.status(201).json({
      message: 'Professional registered successfully. Pending admin approval.',
      user: {
        id: professional._id,
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        address: professional.address,
        professionalDetails: professional.professionalDetails,
        status: professional.status,
        createdAt: professional.createdAt,
        verificationDetails: professional.verificationDetails
      }
    });

  } catch (error) {
    console.error('Professional registration error:', error);
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

### 4. Update Route Configuration
```javascript
import express from 'express';
import { registerProfessional } from './controller.js';
import { uploadKYCFiles } from '../middleware/upload.js';

const router = express.Router();

// Register with file uploads
router.post(
  '/register',
  uploadKYCFiles,
  registerProfessional
);

export default router;
```

### 5. Add Validators Utility
```javascript
// utils/validators.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

export const validateAccountNumber = (acc) => {
  const accRegex = /^\d{9,18}$/;
  return accRegex.test(acc);
};
```

## Additional Considerations

### Security Recommendations
1. **File Encryption**: Encrypt KYC documents at rest
   ```javascript
   import crypto from 'crypto';
   // Implement encryption for sensitive files
   ```

2. **Rate Limiting**: Prevent registration abuse
   ```javascript
   import rateLimit from 'express-rate-limit';
   const registerLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5 // 5 requests per 15 minutes
   });
   ```

3. **Input Sanitization**: Clean all inputs
   ```javascript
   import sanitizeHtml from 'sanitize-html';
   // Sanitize bio and description fields
   ```

4. **Password Hashing**: Use bcrypt with proper salt rounds (already included)

### Database Indexes for Performance
```javascript
db.professionals.createIndex({ email: 1 }, { unique: true });
db.professionals.createIndex({ "address.city": 1 });
db.professionals.createIndex({ "professionalDetails.category": 1 });
db.professionals.createIndex({ status: 1 });
db.professionals.createIndex({ "verificationDetails.kycStatus": 1 });
```

### Email Notifications
```javascript
// Send notifications when:
1. Professional registers (confirmation email)
2. KYC submitted (admin notification)
3. KYC approved (professional notification)
4. KYC rejected (professional notification with reason)
```

### Admin Dashboard Requirements
1. View pending KYC documents
2. Approve/reject applications
3. View professional details
4. Upload verification status

## Migration Notes
- Existing professional records need to be migrated to new schema
- Create migration script to transform old data structure
- Update all related APIs (list, get, update)
- Clear old mock data after migration

## Testing Checklist
- [ ] Test form submission with valid data
- [ ] Test file upload validation
- [ ] Test phone format validation
- [ ] Test IFSC code validation
- [ ] Test duplicate email check
- [ ] Test password hashing
- [ ] Test response format matches schema
- [ ] Test KYC document storage
- [ ] Test status field defaults to "pending"
- [ ] Test email notifications
