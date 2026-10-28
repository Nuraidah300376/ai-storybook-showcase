import { AnimatePresence, motion } from 'motion/react'
import { BUKU, JUMLAH_HALAMAN } from '../data/buku'
import { SLAID, type Slaid } from '../data/slaid'
import { ImejHalaman } from './ImejHalaman'
import { TajukAnimasi } from './TajukAnimasi'

export type Orientasi = 'menegak' | 'landskap'

interface Props {
  indeks: number
  /** Kunci sesi; berubah apabila persembahan diulang supaya animasi bermula semula. */
  sesi: number
  kemajuan: number
  orientasi: Orientasi
}

/**
 * Kandungan pentas persembahan. Saiz teks menggunakan unit cqw/cqh supaya
 * skala kekal seragam pada sebarang saiz skrin.
 */
export function Pentas({ indeks, sesi, kemajuan, orientasi }: Props) {
  const slaid = SLAID[indeks]
  return (
    <div className="bijirin relative h-full w-full overflow-hidden bg-navy-950 [container-type:size]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(33,58,122,0.6),transparent_65%)]" />
      <div className="absolute -top-[20%] -left-[30%] h-[60%] w-[90%] rounded-full bg-emas-500/15 blur-[60px]" />
      <div className="absolute -right-[30%] -bottom-[20%] h-[60%] w-[90%] rounded-full bg-zamrud-500/15 blur-[60px]" />

      {/* Bar kemajuan gaya "stories" */}
      <div className="absolute inset-x-[4cqw] top-[2.5cqh] z-20 flex gap-[0.6cqw]">
        {SLAID.map((_, i) => (
          <div key={i} className="h-[max(2px,0.45cqh)] flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-emas-300"
              style={{ width: `${i < indeks ? 100 : i === indeks ? kemajuan * 100 : 0}%` }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${sesi}-${indeks}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <KandunganSlaid slaid={slaid} orientasi={orientasi} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function KandunganSlaid({ slaid, orientasi }: { slaid: Slaid; orientasi: Orientasi }) {
  const menegak = orientasi === 'menegak'

  if (slaid.jenis === 'pembukaan') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-[7cqw] text-center">
        <p className={`font-semibold tracking-[0.3em] text-emas-300 uppercase ${menegak ? 'text-[3cqw]' : 'text-[1.4cqw]'}`}>
          AI Storybook Showcase
        </p>
        <h2
          className={`font-display mt-[3cqh] leading-[0.95] font-bold [perspective:800px] ${menegak ? 'text-[10.5cqw]' : 'text-[6.2cqw]'}`}
        >
          <TajukAnimasi baris={menegak ? ['SATU', 'PROMPT,', 'SEBUAH', 'BUKU', 'CERITA!'] : ['SATU PROMPT,', 'SEBUAH BUKU CERITA!']} lewat={0.2} />
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-[4cqh]"
        >
          <p className={`font-display text-white italic ${menegak ? 'text-[6cqw]' : 'text-[3cqw]'}`}>{BUKU.tajuk}</p>
          <p className={`mt-[1cqh] text-slate-300 ${menegak ? 'text-[3.6cqw]' : 'text-[1.6cqw]'}`}>
            karya <span className="font-semibold text-zamrud-300">{BUKU.penulis}</span>
          </p>
        </motion.div>
      </div>
    )
  }

  if (slaid.jenis === 'penutup') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-[7cqw] text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`font-display teks-emas font-bold ${menegak ? 'text-[12cqw]' : 'text-[6cqw]'}`}
        >
          Terima kasih
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className={`mt-[3cqh] space-y-[1.2cqh] text-slate-200 ${menegak ? 'text-[4cqw]' : 'text-[1.8cqw]'}`}
        >
          <p className="font-display text-white italic">{BUKU.tajuk}</p>
          <p>
            Penulis: <span className="font-semibold text-zamrud-300">{BUKU.penulis}</span>
          </p>
          <p>
            Pembangun: <span className="font-semibold text-emas-300">{BUKU.pembangun}</span>
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className={`mt-[5cqh] font-semibold tracking-[0.25em] text-emas-300 uppercase ${menegak ? 'text-[3cqw]' : 'text-[1.3cqw]'}`}
        >
          {BUKU.slogan}
        </motion.p>
      </div>
    )
  }

  const { halaman } = slaid
  const label = (
    <p className={`font-semibold tracking-[0.25em] text-emas-300 uppercase ${menegak ? 'text-[3cqw]' : 'text-[1.3cqw]'}`}>
      {halaman.label} / {JUMLAH_HALAMAN}
    </p>
  )
  const teks = halaman.teks && (
    <p className={`font-display leading-snug text-white ${menegak ? 'text-[5cqw]' : 'text-[2.3cqw]'}`}>{halaman.teks}</p>
  )
  const imej = (
    <div className="relative h-full w-full overflow-hidden rounded-[2cqw] border border-emas-400/30 shadow-2xl shadow-black/60">
      <ImejHalaman halaman={halaman} className="h-full w-full" zum />
    </div>
  )

  if (menegak) {
    return (
      <div className="flex h-full flex-col px-[6cqw] pt-[7cqh] pb-[6cqh]">
        {label}
        <p className="font-display mt-[0.6cqh] text-[4.4cqw] text-white/80 italic">{BUKU.tajuk}</p>
        <div className="mt-[3cqh] min-h-0 flex-1">{imej}</div>
        {teks && <div className="mt-[3cqh]">{teks}</div>}
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-[1.6fr_1fr] items-center gap-[4cqw] px-[5cqw] pt-[7cqh] pb-[6cqh]">
      <div className="h-full min-h-0">{imej}</div>
      <div className="space-y-[2cqh]">
        {label}
        <p className="font-display text-[2.4cqw] text-white/80 italic">{BUKU.tajuk}</p>
        {teks}
      </div>
    </div>
  )
}
