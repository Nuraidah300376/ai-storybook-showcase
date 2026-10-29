import { motion } from 'motion/react'
import { BUKU } from '../data/buku'
import { IkonBuku, IkonMain, IkonQr, IkonTelefon } from './Ikon'
import { TajukAnimasi } from './TajukAnimasi'

interface Props {
  onPersembahan: () => void
  onTikTok: () => void
  onTikTok60: () => void
}

const muncul = (lewat: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: lewat, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
})

export function Pembukaan({ onPersembahan, onTikTok, onTikTok60 }: Props) {
  return (
    <section
      id="utama"
      aria-labelledby="tajuk-utama"
      className="relative flex min-h-[100svh] items-center justify-center px-4 pt-28 pb-16 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.p {...muncul(0.1)} className="label-seksyen mb-6">
          <span className="h-px w-8 bg-emas-400/60" />
          AI Storybook Showcase
          <span className="h-px w-8 bg-emas-400/60" />
        </motion.p>

        <h1 id="tajuk-utama" className="font-display leading-[0.95] font-bold tracking-tight [perspective:800px]">
          <TajukAnimasi
            baris={['SATU PROMPT,', 'SEBUAH BUKU CERITA!']}
            lewat={0.35}
            className="block text-[clamp(2.4rem,11vw,6.25rem)]"
          />
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 h-px w-48 origin-center bg-gradient-to-r from-transparent via-emas-400 to-transparent"
        />

        <motion.p {...muncul(1.7)} className="mt-8 max-w-2xl text-base text-slate-300 sm:text-lg">
          Persembahan buku cerita bergambar
        </motion.p>
        <motion.p {...muncul(1.85)} className="mt-2 font-display text-3xl text-white italic sm:text-4xl md:text-5xl">
          {BUKU.tajuk}
        </motion.p>
        <motion.p {...muncul(2)} className="mt-3 text-sm text-slate-400 sm:text-base">
          karya <span className="font-semibold text-zamrud-300">{BUKU.penulis}</span>
        </motion.p>

        <motion.div {...muncul(2.25)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#buku" className="butang-emas">
            <IkonBuku /> Baca Buku
          </a>
          <button type="button" onClick={onPersembahan} className="butang-hantu">
            <IkonMain /> Mod Persembahan
          </button>
          <button type="button" onClick={onTikTok} className="butang-hantu">
            <IkonTelefon /> Mod TikTok 9:16
          </button>
          <button type="button" onClick={onTikTok60} className="butang-zamrud">
            <IkonQr /> TikTok 60 Saat: Master Prompt
          </button>
        </motion.div>
      </div>

      <motion.a
        href="#buku"
        aria-label="Tatal ke bahagian buku"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 3 }, y: { delay: 3, duration: 2, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs tracking-[0.3em] text-slate-500 uppercase sm:block"
      >
        Tatal
      </motion.a>
    </section>
  )
}
