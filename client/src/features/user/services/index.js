// User Services Index - Organized by feature
// Profile APIs - for user and professional profile management
export * from './profileAPI';
export { default as profileAPI } from './profileAPI';

// Home APIs - for home page, services, and professionals browsing
export * from './homeAPI';
export { default as homeAPI } from './homeAPI';

// User APIs - for user-specific operations
export * from './userAPI';
export { default as userAPI } from './userAPI';

// Components
export { default as ServiceProfessionals } from '../home/ServiceProfessionals';
