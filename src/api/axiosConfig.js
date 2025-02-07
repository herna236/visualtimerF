import axios from 'axios';

const api = axios.create({
  baseURL: 'https://visualtimerbe.onrender.com',
});

export default api;
