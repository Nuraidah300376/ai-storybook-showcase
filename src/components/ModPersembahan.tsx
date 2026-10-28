import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SLAID, tempohSlaid } from '../data/slaid'
import { useAutoplay } from '../hooks/useAutoplay'
import {
  IkonJeda,
  IkonKanan,
  IkonKiri,
  IkonMain,
  IkonMataTutup,
  IkonMonitor,
  IkonSkrinPenuh,
  IkonTelefon,
  IkonTutup,
  IkonUlang,
} from './Ikon'
import { Pentas, type Orientasi } from './Pentas'

interface Props {
  orientasiAwal: Orientasi
  onTutup: () => void
}

const NISBAH: Record<Orientasi, number> = { menegak: 9 / 16, landskap: 16 / 9 }

/** Kira saiz pentas terbesar yang muat dalam bekas mengikut nisbah. */
function useSaizPentas(nisbah: number) {
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

export function ModPersembahan({ orientasiAwal, onTutup }: Props) {
  const [orientasi, setOrientasi] = useState<Orientasi>(orientasiAwal)
  const [kawalanTersembunyi, setKawalanTersembunyi] = useState(false)
  const [petunjuk, setPetunjuk] = useState(false)
  const akarRef = useRef<HTMLDivElement>(null)
  const ap = useAutoplay({ jumlah: SLAID.length, tempoh: tempohSlaid })
  const { ref: bekasRef, saiz } = useSaizPentas(NISBAH[orientasi])

  // Kunci tatalan halaman di belakang dan fokus pada dialog.
  useEffect(() => {
    const asal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    akarRef.current?.focus()
    return () => {
      document.body.style.overflow = asal
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    }
  }, [])

  const sembunyi = useCallback(() => {
    setKawalanTersembunyi(true)
    setPetunjuk(true)
  }, [])

  useEffect(() => {
    if (!petunjuk) return
    const t = window.setTimeout(() => setPetunjuk(false), 2600)
    return () => window.clearTimeout(t)
  }, [petunjuk])

  const togolSkrinPenuh = useCallback(() => {
    const el = akarRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    else void el.requestFullscreen?.().catch(() => {})
  }, [])

  const { togol, ulang, seterusnya, sebelumnya } = ap
  useEffect(() => {
    const onKekunci = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      // Biarkan butang yang difokus mengendalikan Ruang sendiri (elak togol berganda).
      if (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button')) return
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault()
          togol()
          break
        case 'ArrowRight':
          seterusnya()
          break
        case 'ArrowLeft':
          sebelumnya()
          break
        case 'r':
        case 'R':
          ulang()
          break
        case 'h':
        case 'H':
          setKawalanTersembunyi((s) => !s)
          break
        case 'f':
        case 'F':
          togolSkrinPenuh()
          break
        case 'Escape':
          if (!document.fullscreenElement) onTutup()
          break
      }
    }
    window.addEventListener('keydown', onKekunci)
    return () => window.removeEventListener('keydown', onKekunci)
  }, [togol, ulang, seterusnya, sebelumnya, togolSkrinPenuh, onTutup])

  const labelMain = ap.bermain ? 'Jeda' : 'Mula'

  return (
    <motion.div
      ref={akarRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mod persembahan automatik"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex flex-col bg-black outline-none"
      onClick={kawalanTersembunyi ? () => setKawalanTersembunyi(false) : undefined}
    >
      <div ref={bekasRef} className={`relative flex min-h-0 flex-1 items-center justify-center ${kawalanTersembunyi ? '' : 'p-3 sm:p-5'}`}>
        <div
          style={{ width: saiz.w, height: saiz.h }}
          className={`relative overflow-hidden ${kawalanTersembunyi ? '' : 'rounded-2xl ring-1 ring-white/10'}`}
        >
          {saiz.w > 0 && <Pentas indeks={ap.indeks} sesi={ap.sesi} kemajuan={ap.kemajuan} orientasi={orientasi} />}
        </div>

        <AnimatePresence>
          {petunjuk && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-center text-xs text-slate-200"
            >
              Tekan H atau ketik skrin untuk memaparkan kawalan
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!kawalanTersembunyi && (
        <div className="border-t border-white/10 bg-navy-950/95 px-3 py-3 sm:px-5">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <button type="button" className="butang-hantu px-3" onClick={sebelumnya} aria-label="Slaid sebelumnya">
                <IkonKiri />
              </button>
              <button type="button" className="butang-emas min-w-28" onClick={togol} aria-pressed={ap.bermain}>
                {ap.bermain ? <IkonJeda /> : <IkonMain />} {labelMain}
              </button>
              <button type="button" className="butang-zamrud" onClick={ulang}>
                <IkonUlang /> Ulang
              </button>
              <button type="button" className="butang-hantu px-3" onClick={seterusnya} aria-label="Slaid seterusnya">
                <IkonKanan />
              </button>
            </div>

            <span className="hidden px-2 text-xs text-slate-400 tabular-nums sm:inline" aria-live="polite">
              {ap.indeks + 1} / {SLAID.length}
              {ap.tamat && ' · Tamat'}
            </span>

            <div className="flex items-center gap-2">
              <div role="group" aria-label="Orientasi pentas" className="flex rounded-full border border-white/15 p-1">
                {(['menegak', 'landskap'] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={orientasi === o}
                    onClick={() => setOrientasi(o)}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition ${
                      orientasi === o ? 'bg-white text-navy-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {o === 'menegak' ? <IkonTelefon /> : <IkonMonitor />}
                    {o === 'menegak' ? '9:16' : '16:9'}
                  </button>
                ))}
              </div>
              <button type="button" className="butang-hantu px-3" onClick={togolSkrinPenuh} aria-label="Skrin penuh" title="Skrin penuh (F)">
                <IkonSkrinPenuh />
              </button>
              <button
                type="button"
                className="butang-hantu px-3"
                onClick={(e) => {
                  e.stopPropagation()
                  sembunyi()
                }}
                aria-label="Sembunyikan kawalan untuk rakaman"
                title="Sembunyikan kawalan (H)"
              >
                <IkonMataTutup />
              </button>
              <button type="button" className="butang-hantu px-3" onClick={onTutup} aria-label="Tutup mod persembahan" title="Tutup (Esc)">
                <IkonTutup />
              </button>
            </div>
          </div>
          <p className="mt-2 hidden text-center text-[0.7rem] text-slate-500 md:block">
            Pintasan: Ruang = Mula/Jeda · ← → = Navigasi · R = Ulang · H = Sembunyi kawalan · F = Skrin penuh · Esc = Tutup
          </p>
        </div>
      )}
    </motion.div>
  )
}
