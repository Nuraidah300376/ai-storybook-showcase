import { useSyncExternalStore } from 'react'

function langgan(ubah: () => void) {
  window.addEventListener('hashchange', ubah)
  return () => window.removeEventListener('hashchange', ubah)
}

/** Hash URL semasa, contohnya '#/showcase'. */
export function useHash(): string {
  return useSyncExternalStore(
    langgan,
    () => window.location.hash,
    () => '',
  )
}

/** Laluan hash khas aplikasi. */
export const LALUAN = {
  showcase: '#/showcase',
  masterPrompt: '#/master-prompt',
} as const
