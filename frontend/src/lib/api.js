import axios from 'axios';

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// Falls back to localhost:4000 for local dev against the backend in this repo.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({ baseURL });

// Attach the JWT to every request if we have one stored.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('concise_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 anywhere means the token is dead — bounce to login rather than
// letting every page handle that case individually.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('concise_token');
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/links')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(error, fallback = 'Something went wrong.') {
  return error?.response?.data?.error || error?.message || fallback;
}
