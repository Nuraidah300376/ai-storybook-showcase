import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { HALAMAN, JUMLAH_HALAMAN } from '../../data/buku'
import { useImejDimuatNaik } from '../../lib/storImej'
import { IkonBuku, IkonKanan, IkonKiri, IkonTutup } from '../Ikon'
import { ImejHalaman, useImejAsal } from '../ImejHalaman'
import { LabelSumber } from './LabelSumber'

interface Props {
  /** Indeks halaman (0..11). */
  indeks: number
  onTukar: (indeks: number) => void
  onTutup: () => void
  onLihatDalamBuku: (indeks: number) => void
}

/** Dialog pratonton satu halaman A5 dalam saiz penuh, tanpa dipotong. */
export function PratontonHalaman({ indeks, onTukar, onTutup, onLihatDalamBuku }: Props) {
  const halaman = HALAMAN[indeks]
  const dimuatNaik = useImejDimuatNaik(halaman.nombor)
  const asal = useImejAsal(halaman.nombor)
  const tutupRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fokusAsal = document.activeElement as HTMLElement | null
    const tatal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    tutupRef.current?.focus()
    return () => {
      document.body.style.overflow = tatal
      fokusAsal?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKekunci = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onTutup()
      else if (e.key === 'ArrowRight' && indeks < JUMLAH_HALAMAN - 1) onTukar(indeks + 1)
      else if (e.key === 'ArrowLeft' && indeks > 0) onTukar(indeks - 1)
    }
    window.addEventListener('keydown', onKekunci)
    return () => window.removeEventListener('keydown', onKekunci)
  }, [indeks, onTukar, onTutup])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Pratonton ${halaman.label}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col bg-navy-950/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onTutup()}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-display text-lg text-white">{halaman.label}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <LabelSumber dimuatNaik={dimuatNaik} asal={asal} />
            {dimuatNaik && (
              <span className="truncate">
                {dimuatNaik.nama} · {dimuatNaik.lebar}×{dimuatNaik.tinggi} px
              </span>
            )}
          </div>
        </div>
        <button ref={tutupRef} type="button" className="butang-hantu shrink-0 px-3" onClick={onTutup} aria-label="Tutup pratonton">
          <IkonTutup />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6" onClick={(e) => e.target === e.currentTarget && onTutup()}>
        {/* Saiz terbesar yang muat pada skrin dengan nisbah A5 potret. */}
        <div
          className="aspect-[148/210] overflow-hidden rounded-lg shadow-2xl ring-1 ring-emas-400/30"
          style={{ width: 'min(100%, calc((100svh - 11rem) * 148 / 210))' }}
        >
          <ImejHalaman halaman={halaman} className="h-full w-full bg-navy-900" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 px-4 py-3">
        <button type="button" className="butang-hantu px-3" onClick={() => onTukar(indeks - 1)} disabled={indeks === 0} aria-label="Halaman sebelumnya">
          <IkonKiri />
        </button>
        <span className="min-w-16 text-center text-sm text-slate-300 tabular-nums">
          {indeks + 1} / {JUMLAH_HALAMAN}
        </span>
        <button
          type="button"
          className="butang-hantu px-3"
          onClick={() => onTukar(indeks + 1)}
          disabled={indeks === JUMLAH_HALAMAN - 1}
          aria-label="Halaman seterusnya"
        >
          <IkonKanan />
        </button>
        <button type="button" className="butang-emas" onClick={() => onLihatDalamBuku(indeks)}>
          <IkonBuku /> Lihat dalam buku
        </button>
      </div>
    </motion.div>
  )
}
