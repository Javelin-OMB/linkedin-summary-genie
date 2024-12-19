// Add your allowed origins here
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://8962ae1d-8eda-4b79-9777-6a519a56c322.lovableproject.com',
  window.location.origin
];

// Session timeout duration (15 minutes)
export const SESSION_TIMEOUT = 15 * 60 * 1000;

// Loading state timeout (30 seconds)
export const LOADING_TIMEOUT = 30 * 1000;