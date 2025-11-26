// react-app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // if this app will be served under a subpath (e.g. GitHub Pages monorepo):
  // base: '/builder-design-system/react-app/',
});