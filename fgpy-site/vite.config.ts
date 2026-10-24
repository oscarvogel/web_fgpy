import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Inline (empty) PostCSS config: stops Vite from picking up the old site's postcss.config.js in the repo root.
  css: { postcss: {} },
})
