export * from './validators.js';

export const generateOTP = (length = 6) => {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
};

export const formatPhoneNumber = (phone) => {
  if (phone.startsWith('+')) return phone;
  if (phone.startsWith('91')) return `+${phone}`;
  return `+91${phone}`;
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};