import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import gallery from './vite-plugin-gallery.js';

export default defineConfig({
  plugins: [react(), gallery()],
});
