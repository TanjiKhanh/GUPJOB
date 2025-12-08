import axios, { AxiosError } from 'axios';
import { getAccessToken, setAccessToken } from '../auth/tokenStore';

const api = axios.create({
  baseURL: '/api', // proxied to gateway by Vite (see vite.config.ts)
  withCredentials: true, // send cookies (refresh token) to gateway
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request: attach access token from memory
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    // ensure headers object exists and assign Authorization without replacing AxiosHeaders instance
    if (!config.headers) {
      (config as any).headers = {};
    }
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response: if 401, attempt one refresh and retry original request
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    // If 401 and not already retried
    if (status === 401 && !originalRequest._retry) {
      // Mark to avoid infinite loop
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // Call gateway refresh endpoint. Cookie is sent because withCredentials = true
        const resp = await axios.post(
          '/api/auth/refresh',
          {},
          { withCredentials: true, baseURL: '/' } // direct to dev server root, proxied -> gateway
        );
        const newAccessToken = resp.data?.access_token;
        setAccessToken(newAccessToken || null);
        processQueue(newAccessToken || null);
        // retry original request with new token
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;