// Central API configuration
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login/`,
  refreshToken: `${API_BASE_URL}/api/auth/login/refresh/`,
  passwordReset: `${API_BASE_URL}/api/auth/password-reset/`,
  register: `${API_BASE_URL}/api/auth/register/`,
  
  // ML endpoints
  predictor: `${API_BASE_URL}/api/predictor/predict/`,
  survival: `${API_BASE_URL}/api/survival/predict-survival/`,
  imagePredict: `${API_BASE_URL}/api/image_predict/`,
  
  // Patient management
  patients: `${API_BASE_URL}/api/patients/`,
  
  // Doctor management
  doctors: `${API_BASE_URL}/api/doctors/`,
  
  // User management (admin only)
  users: `${API_BASE_URL}/api/auth/users/`,
};
