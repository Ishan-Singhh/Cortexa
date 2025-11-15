// src/api.js

import axios from 'axios';
import { Clerk } from '@clerk/clerk-js';

// Initialize Clerk with your Publishable Key
const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use(
  async (config) => {
    await clerk.load();
    const token = await clerk.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;