import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' membolehkan hasil binaan dibuka dari mana-mana laluan
// (contohnya GitHub Pages atau folder tempatan).
//
// Mod `pratonton` (npm run binaan:pratonton) menghasilkan satu fail HTML
// lengkap dalam folder pratonton/ yang boleh dibuka terus tanpa Node.js.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'pratonton' ? [viteSingleFile()] : [])],
  build:
    mode === 'pratonton'
      ? { outDir: 'pratonton', emptyOutDir: false, copyPublicDir: false }
      : undefined,
  test: {
    environment: 'node',
  },
}))
