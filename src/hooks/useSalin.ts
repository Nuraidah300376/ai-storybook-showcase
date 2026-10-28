import { useCallback, useEffect, useRef, useState } from 'react'

type Status = 'sedia' | 'berjaya' | 'gagal'

/** Salin teks ke papan keratan, dengan sandaran untuk pelayar lama. */
export function useSalin(tempohMs = 2200) {
  const [status, setStatus] = useState<Status>('sedia')
  const pemasa = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(pemasa.current), [])

  const salin = useCallback(
    async (teks: string) => {
      let ok = false
      try {
        await navigator.clipboard.writeText(teks)
        ok = true
      } catch {
        const ta = document.createElement('textarea')
        ta.value = teks
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try {
          ok = document.execCommand('copy')
        } catch {
          ok = false
        }
        ta.remove()
      }
      setStatus(ok ? 'berjaya' : 'gagal')
      window.clearTimeout(pemasa.current)
      pemasa.current = window.setTimeout(() => setStatus('sedia'), tempohMs)
    },
    [tempohMs],
  )

  return { status, salin }
}
