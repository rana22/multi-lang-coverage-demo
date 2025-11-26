import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const raw = process.env.BASE_PATH ?? '';
const base = raw.endsWith('/') ? raw : raw + '/';   // force trailing slash

export default defineConfig({
  plugins: [react()],
	base
  // if you deploy to GitHub Pages under a subpath, set base here:
  // base: '/your-repo-name/',
});
