import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';

// Create an axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to format prediction data
export const formatPredictionData = (data: any) => {
  return {
    ...data,
    patient_id: parseInt(data.patient_id),
    doctor_id: parseInt(data.doctor_id),
  };
};
