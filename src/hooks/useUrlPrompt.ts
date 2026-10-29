import { useCallback, useSyncExternalStore } from 'react'
import { URL_PERKONGSIAN_PROMPT } from '../data/tiktok'
import { sahkanUrlAwam } from '../lib/urlAwam'

const KUNCI = 'ai-storybook:url-prompt'
const pendengar = new Set<() => void>()

function baca(): string {
  try {
    return localStorage.getItem(KUNCI) ?? ''
  } catch {
    return ''
  }
}

function langgan(p: () => void) {
  pendengar.add(p)
  const onStorage = (e: StorageEvent) => e.key === KUNCI && p()
  window.addEventListener('storage', onStorage)
  return () => {
    pendengar.delete(p)
    window.removeEventListener('storage', onStorage)
  }
}

export type SumberUrl = 'pelayar' | 'fail' | 'tiada'

/**
 * URL perkongsian master prompt untuk kod QR.
 * Keutamaan: URL yang ditetapkan dalam pelayar ini → `URL_PERKONGSIAN_PROMPT`
 * dalam src/data/tiktok.ts → tiada (placeholder BELUM DIKONFIGURASI).
 * Hanya URL yang lulus pengesahan dipulangkan sebagai `url`.
 */
export function useUrlPrompt() {
  const disimpan = useSyncExternalStore(langgan, baca, () => '')

  const tetapkan = useCallback((url: string) => {
    try {
      if (url) localStorage.setItem(KUNCI, url)
      else localStorage.removeItem(KUNCI)
    } catch {
      // Storan disekat (mod peribadi): tetapan tidak dapat disimpan.
    }
    for (const p of pendengar) p()
  }, [])

  const calon = disimpan || URL_PERKONGSIAN_PROMPT
  const sumber: SumberUrl = disimpan ? 'pelayar' : URL_PERKONGSIAN_PROMPT ? 'fail' : 'tiada'
  const semakan = calon ? sahkanUrlAwam(calon) : null
  return {
    url: semakan?.sah ? semakan.url : null,
    /** Sebab URL ditolak, jika ada URL yang tidak sah. */
    ralat: semakan && !semakan.sah ? semakan.sebab : null,
    sumber,
    disimpan,
    tetapkan,
  }
}
