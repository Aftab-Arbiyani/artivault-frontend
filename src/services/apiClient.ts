import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      // Silently handle — let components show their own empty states
    } else if (status && status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Check your connection.');
    }

    return Promise.reject({ status, message, original: error });
  }
);

export default apiClient;
