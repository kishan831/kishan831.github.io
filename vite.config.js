import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// kishan831.github.io is a USER pages site served from the domain root,
// so the base path is '/'. No sub-path config needed.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // The 3D scene (three.js) is intentionally lazy-loaded into its own chunk,
    // so the default 500 kB warning is expected noise — raise the threshold.
    chunkSizeWarningLimit: 900,
  },
})
