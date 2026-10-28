import { useSyncExternalStore } from 'react'

/** Pantau media query CSS, contohnya '(min-width: 1024px)'. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (ubah) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', ubah)
      return () => mql.removeEventListener('change', ubah)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
