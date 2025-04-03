import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://develfood-gabriel.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});