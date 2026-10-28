import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' membolehkan hasil binaan dibuka dari mana-mana laluan
// (contohnya GitHub Pages atau folder tempatan).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
  },
})
