import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': 'https://backend1-q4cw.onrender.com', // Proxy the /register API to the backend
    }
  }
});
