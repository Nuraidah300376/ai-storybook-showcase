import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' membolehkan hasil binaan dibuka dari mana-mana laluan
// (contohnya GitHub Pages atau folder tempatan).
//
// Mod `pratonton` (npm run binaan:pratonton) menghasilkan satu fail HTML
// lengkap dalam folder pratonton/ yang boleh dibuka terus tanpa Node.js.
//
// Binaan biasa menghasilkan dua halaman: index.html (aplikasi penuh) dan
// prompt/index.html (halaman MASTER PROMPT PENUH yang ringan untuk kod QR).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'pratonton' ? [viteSingleFile()] : [])],
  build:
    mode === 'pratonton'
      ? { outDir: 'pratonton', emptyOutDir: false, copyPublicDir: false }
      : {
          rollupOptions: {
            input: {
              main: 'index.html',
              prompt: 'prompt/index.html',
            },
          },
        },
  test: {
    environment: 'node',
  },
}))
