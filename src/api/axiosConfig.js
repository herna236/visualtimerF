import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend1-q4cw.onrender.com',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
