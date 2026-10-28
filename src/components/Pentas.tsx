import { AnimatePresence, motion } from 'motion/react'
import { BUKU, JUMLAH_HALAMAN } from '../data/buku'
import { SLAID, type Slaid } from '../data/slaid'
import { BukuSelak } from './buku/BukuSelak'
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
  // Kemajuan keseluruhan bahagian buku (0..1) untuk kesan zum perlahan.
  const zum = slaid.jenis === 'halaman' ? Math.min(1, (slaid.halaman.nombor - 1 + kemajuan) / JUMLAH_HALAMAN) : 0
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
          key={`${sesi}-${slaid.jenis === 'halaman' ? 'buku' : indeks}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <KandunganSlaid slaid={slaid} orientasi={orientasi} zum={zum} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function KandunganSlaid({ slaid, orientasi, zum }: { slaid: Slaid; orientasi: Orientasi; zum: number }) {
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

  return <SlaidBuku indeks={slaid.halaman.nombor - 1} orientasi={orientasi} zum={zum} />
}

/** Nisbah A5 potret (lebar ÷ tinggi). */
const A5 = '148 / 210'

/**
 * Lebar buku dalam unit pentas (cqw/cqh): terbesar yang muat tanpa memotong
 * halaman A5. Menegak = satu halaman; landskap = hamparan dua halaman.
 */
const LEBAR_BUKU = {
  menegak: `min(88cqw, calc(76cqh * ${A5}))`,
  landskap: `min(86cqw, calc(74cqh * 2 * ${A5}))`,
} as const

/**
 * Semua 12 halaman berkongsi satu buku yang kekal dipasang, supaya setiap
 * pertukaran slaid menjadi animasi selak halaman (bukan pudar).
 */
function SlaidBuku({ indeks, orientasi, zum }: { indeks: number; orientasi: Orientasi; zum: number }) {
  const menegak = orientasi === 'menegak'
  const lebar = LEBAR_BUKU[orientasi]
  return (
    <div className="flex h-full flex-col items-center justify-center px-[5cqw] pt-[5cqh] pb-[3cqh]">
      <div className="mb-[2.5cqh] flex items-baseline justify-between" style={{ width: lebar }}>
        <p className={`font-display text-white/85 italic ${menegak ? 'text-[4.2cqw]' : 'text-[1.9cqw]'}`}>{BUKU.tajuk}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={indeks}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={`font-semibold tracking-[0.25em] text-emas-300 uppercase tabular-nums ${menegak ? 'text-[2.8cqw]' : 'text-[1.1cqw]'}`}
          >
            {indeks + 1} / {JUMLAH_HALAMAN}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* Zum perlahan mengikut kemajuan persembahan; berhenti apabila dijeda. */}
      <div className={menegak ? 'pl-[2.5cqw]' : ''} style={{ width: lebar, transform: `scale(${1 + 0.035 * zum})` }}>
        <BukuSelak
          indeks={indeks}
          mod={menegak ? 'tunggal' : 'hamparan'}
          tempohMs={menegak ? 850 : 950}
          mulaDariJudul
          serlah
          className={menegak ? 'aspect-[148/210] w-full' : 'aspect-[296/210] w-full'}
        />
      </div>
    </div>
  )
}
