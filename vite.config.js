import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/QingWen-YuweiMa-project2/',
  server: {
    port: 5173,
  },
});
