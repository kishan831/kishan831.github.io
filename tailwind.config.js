/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black surfaces with slightly elevated steps (not pure #000)
        surface: {
          50: '#f4f4f6', 100: '#e2e2e8', 200: '#c5c5cd', 300: '#9e9eac',
          400: '#6b6b80', 500: '#1c1c2e', 600: '#141424', 700: '#0e0e1b',
          800: '#0a0a14', 900: '#07070d',
        },
        // Brand accent — mint (contrast-tuned in Phase 2/4 for a11y)
        mint: {
          50: '#e6fff5', 100: '#b3ffe0', 200: '#80ffcc', 300: '#4dfdb5',
          400: '#1ae89e', 500: '#00d68a', 600: '#00ad6f', 700: '#008454',
          800: '#005b3a', 900: '#00331f',
        },
        ember: { 400: '#fca556', 500: '#f59042', 600: '#e07a2f' },
      },
      fontFamily: {
        heading: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Fluid type scale — clamp(min, preferred, max). Kills overflow from
        // oversized fixed headings on small screens (the Android cut-off fix).
        'fluid-sm': 'clamp(0.875rem, 0.83rem + 0.22vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)',
        'fluid-xl': 'clamp(1.375rem, 1.2rem + 0.9vw, 1.875rem)',
        'fluid-2xl': 'clamp(1.75rem, 1.4rem + 1.7vw, 2.75rem)',
        'fluid-hero': 'clamp(2.25rem, 1.5rem + 3.8vw, 4rem)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}
