// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://rhythmrep.netlify.app/.netlify/functions/api' 
    : 'http://localhost:5000'
  );

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
}; 