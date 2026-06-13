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
  },
})
