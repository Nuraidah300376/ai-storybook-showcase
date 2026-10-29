import { useLayoutEffect, useRef, useState } from 'react'

/** Kira saiz pentas terbesar yang muat dalam bekas mengikut nisbah (lebar ÷ tinggi). */
export function useSaizPentas(nisbah: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [saiz, setSaiz] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const kira = () => {
      const { width, height } = el.getBoundingClientRect()
      const w = Math.min(width, height * nisbah)
      setSaiz({ w: Math.floor(w), h: Math.floor(w / nisbah) })
    }
    kira()
    const ro = new ResizeObserver(kira)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nisbah])

  return { ref, saiz }
}
