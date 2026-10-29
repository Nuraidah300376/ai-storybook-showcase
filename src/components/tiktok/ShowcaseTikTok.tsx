import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { JUMLAH_HALAMAN } from '../../data/buku'
import { PENTAS } from '../../data/tiktok'
import { useAutoplay } from '../../hooks/useAutoplay'
import { useUrlPrompt } from '../../hooks/useUrlPrompt'
import { JUMLAH_MS, binaSlaid, formatMasa, kedudukanPadaMasa, masaKeseluruhan, masaMulaSlaid } from '../../lib/garisMasa'
import { IkonJeda, IkonMain, IkonMataTutup, IkonSkrinPenuh, IkonTutup, IkonUlang } from '../Ikon'
import { PentasSinematik } from './PentasSinematik'

const SLAID = binaSlaid(JUMLAH_HALAMAN)
const MULA = masaMulaSlaid(SLAID)
const tempoh = (i: number) => SLAID[i].tempohMs

/** Skala terbesar supaya pentas 1080×1920 muat dalam bekas. */
function useSkala() {
  const ref = useRef<HTMLDivElement>(null)
  const [skala, setSkala] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const kira = () => {
      const { width, height } = el.getBoundingClientRect()
      setSkala(Math.min(width / PENTAS.lebar, height / PENTAS.tinggi))
    }
    kira()
    const ro = new ResizeObserver(kira)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, skala }
}

/**
 * TikTok Cinematic Showcase: persembahan menegak 9:16 selama 60 saat pada
 * kawasan asas 1080×1920. Tiada eksport video — rakam dengan perakam skrin.
 */
export function ShowcaseTikTok({ onTutup }: { onTutup: () => void }) {
  const akarRef = useRef<HTMLDivElement>(null)
  const ap = useAutoplay({ jumlah: SLAID.length, tempoh })
  const { ref: bekasRef, skala } = useSkala()
  const { url } = useUrlPrompt()
  const [kawalanTersembunyi, setKawalanTersembunyi] = useState(false)
  const [zonSelamat, setZonSelamat] = useState(false)
  const [mesej, setMesej] = useState<string | null>(null)
  const [pernahMula, setPernahMula] = useState(false)

  const ms = masaKeseluruhan(MULA, ap.indeks, ap.berlalu)
  const slaid = SLAID[ap.indeks]

  useEffect(() => {
    if (ap.bermain) setPernahMula(true)
  }, [ap.bermain])

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

  useEffect(() => {
    if (!mesej) return
    const t = window.setTimeout(() => setMesej(null), 2800)
    return () => window.clearTimeout(t)
  }, [mesej])

  const sembunyi = useCallback(() => {
    setKawalanTersembunyi(true)
    setMesej('Ketik skrin atau tekan H untuk memaparkan kawalan')
  }, [])

  const togolSkrinPenuh = useCallback(() => {
    const el = akarRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
      return
    }
    if (!el.requestFullscreen) {
      setMesej('Skrin penuh tidak disokong pelayar ini. Gunakan Sembunyikan Kawalan.')
      return
    }
    void el.requestFullscreen().catch(() => setMesej('Skrin penuh ditolak oleh pelayar.'))
  }, [])

  const { togol, ulang, loncat } = ap
  const lompat = useCallback(
    (sasaranMs: number) => {
      const k = kedudukanPadaMasa(SLAID, Math.min(JUMLAH_MS - 1, Math.max(0, sasaranMs)))
      loncat(k.indeks, k.berlalu)
      setPernahMula(true)
    },
    [loncat],
  )

  const msRef = useRef(ms)
  msRef.current = ms
  useEffect(() => {
    const onKekunci = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const sasaran = e.target instanceof HTMLElement ? e.target : null
      if (e.key === ' ' && sasaran?.closest('button')) return
      if (sasaran?.closest('input')) return
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault()
          togol()
          break
        case 'r':
        case 'R':
          ulang()
          break
        case 'ArrowRight':
          lompat(msRef.current + 5000)
          break
        case 'ArrowLeft':
          lompat(msRef.current - 5000)
          break
        case 'h':
        case 'H':
          setKawalanTersembunyi((s) => !s)
          break
        case 'z':
        case 'Z':
          setZonSelamat((s) => !s)
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
  }, [togol, ulang, lompat, togolSkrinPenuh, onTutup])

  const peratus = (ms / JUMLAH_MS) * 100

  return (
    <motion.div
      ref={akarRef}
      role="dialog"
      aria-modal="true"
      aria-label="TikTok Cinematic Showcase 9:16"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex flex-col bg-black outline-none"
      onClick={kawalanTersembunyi ? () => setKawalanTersembunyi(false) : undefined}
    >
      <div ref={bekasRef} className={`relative min-h-0 flex-1 ${kawalanTersembunyi ? '' : 'm-2 sm:m-4'}`}>
        {skala > 0 && (
          <div
            className={`absolute top-1/2 left-1/2 overflow-hidden ${kawalanTersembunyi ? '' : 'rounded-xl ring-1 ring-white/10'}`}
            style={{ width: PENTAS.lebar * skala, height: PENTAS.tinggi * skala, transform: 'translate(-50%, -50%)' }}
          >
            <div style={{ width: PENTAS.lebar, height: PENTAS.tinggi, transform: `scale(${skala})`, transformOrigin: '0 0' }}>
              <PentasSinematik
                ms={ms}
                indeksBuku={slaid.indeksBuku}
                sesi={ap.sesi}
                sedia={!pernahMula}
                urlQR={url}
                paparZonSelamat={zonSelamat}
              />
            </div>
            {!pernahMula && !kawalanTersembunyi && (
              <button
                type="button"
                onClick={togol}
                className="absolute inset-0 grid place-items-center bg-black/30 text-center"
                aria-label="Mula persembahan 60 saat"
              >
                <span className="flex flex-col items-center gap-3">
                  <span className="grid size-16 place-items-center rounded-full bg-gradient-to-b from-emas-300 to-emas-500 text-2xl text-navy-950 shadow-[0_10px_40px_-8px_rgba(227,182,74,0.7)]">
                    <IkonMain />
                  </span>
                  <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm text-slate-100">Tekan Mula · 60 saat</span>
                </span>
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {mesej && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="pointer-events-none absolute bottom-6 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-center text-xs text-slate-100"
            >
              {mesej}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!kawalanTersembunyi && (
        <div className="border-t border-white/10 bg-navy-950/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <div className="mx-auto flex max-w-3xl items-center gap-3 text-xs text-slate-400 tabular-nums">
            <span aria-hidden="true">{formatMasa(ms)}</span>
            <input
              type="range"
              min={0}
              max={JUMLAH_MS}
              step={100}
              value={Math.round(ms)}
              onChange={(e) => lompat(Number(e.target.value))}
              aria-label="Garis masa persembahan"
              aria-valuetext={`${formatMasa(ms)} daripada ${formatMasa(JUMLAH_MS)}`}
              className="garis-masa h-6 min-w-0 flex-1 cursor-pointer"
              style={{ ['--isi' as string]: `${peratus}%` }}
            />
            <span aria-hidden="true">{formatMasa(JUMLAH_MS)}</span>
          </div>
          <div className="mx-auto mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            <button type="button" className="butang-emas min-w-28" onClick={togol} aria-pressed={ap.bermain}>
              {ap.bermain ? <IkonJeda /> : <IkonMain />} {ap.bermain ? 'Jeda' : 'Mula'}
            </button>
            <button type="button" className="butang-zamrud" onClick={ulang}>
              <IkonUlang /> Ulang
            </button>
            <button type="button" className="butang-hantu" onClick={togolSkrinPenuh} title="Skrin penuh (F)">
              <IkonSkrinPenuh /> <span className="hidden sm:inline">Skrin Penuh</span>
            </button>
            <button
              type="button"
              className="butang-hantu"
              onClick={(e) => {
                e.stopPropagation()
                sembunyi()
              }}
              title="Sembunyikan kawalan (H)"
            >
              <IkonMataTutup /> <span className="hidden sm:inline">Sembunyikan Kawalan</span>
            </button>
            <button
              type="button"
              className={`butang-hantu px-3 text-xs ${zonSelamat ? 'border-zamrud-400/70 text-zamrud-200' : ''}`}
              aria-pressed={zonSelamat}
              onClick={() => setZonSelamat((s) => !s)}
              title="Papar panduan zon selamat TikTok (Z)"
            >
              Zon Selamat
            </button>
            <button type="button" className="butang-hantu px-3" onClick={onTutup} aria-label="Tutup showcase" title="Tutup (Esc)">
              <IkonTutup />
            </button>
          </div>
          <p className="mt-2 hidden text-center text-[0.7rem] text-slate-500 md:block">
            Ruang = Mula/Jeda · R = Ulang · ← → = ±5 saat · F = Skrin penuh · H = Sembunyi kawalan · Z = Zon selamat · Esc = Tutup
            {ap.tamat && ' · Tamat'}
          </p>
          <p className="sr-only" aria-live="polite">
            {ap.tamat ? 'Persembahan tamat.' : ''}
          </p>
        </div>
      )}
    </motion.div>
  )
}
