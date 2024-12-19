// Add your allowed origins here
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  window.location.origin
];

// Session timeout duration (15 minutes)
export const SESSION_TIMEOUT = 15 * 60 * 1000;

// Loading state timeout (30 seconds)
export const LOADING_TIMEOUT = 30 * 1000;