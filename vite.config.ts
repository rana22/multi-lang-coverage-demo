import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // if you deploy to GitHub Pages under a subpath, set base here:
  // base: '/your-repo-name/',
});
