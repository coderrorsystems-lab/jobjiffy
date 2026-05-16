// Central API Services Export
// All API calls are organized by module

export * as adminAPI from './admin';
export * as authAPI from './auth';
export * as profileAPI from './profile';

// Default export for backward compatibility
import * as admin from './admin';
import * as auth from './auth';
import * as profile from './profile';

export default {
  admin,
  auth,
  profile,
};
