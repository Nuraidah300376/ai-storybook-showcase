import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { pluginEksportVideo } from './scripts/pluginEksportVideo'

// base: './' membolehkan hasil binaan dibuka dari mana-mana laluan
// (contohnya GitHub Pages atau folder tempatan).
//
// Mod `pratonton` (npm run binaan:pratonton) menghasilkan satu fail HTML
// lengkap dalam folder pratonton/ yang boleh dibuka terus tanpa Node.js.
//
// pluginEksportVideo menambah API eksport MP4 pada pelayan tempatan sahaja
// (npm run dev / preview); hasil binaan statik tidak terjejas.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), pluginEksportVideo(), ...(mode === 'pratonton' ? [viteSingleFile()] : [])],
  build:
    mode === 'pratonton'
      ? { outDir: 'pratonton', emptyOutDir: false, copyPublicDir: false }
      : undefined,
  test: {
    environment: 'node',
  },
}))
