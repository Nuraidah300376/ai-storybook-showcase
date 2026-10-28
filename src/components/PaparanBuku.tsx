import { motion } from 'motion/react'
import { useCallback, useState, type KeyboardEvent } from 'react'
import { BUKU, HALAMAN, JUMLAH_HALAMAN } from '../data/buku'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { BukuSelak } from './buku/BukuSelak'
import { IkonKanan, IkonKiri } from './Ikon'
import { ImejHalaman } from './ImejHalaman'
import { KepalaSeksyen } from './KepalaSeksyen'

export function PaparanBuku() {
  const [indeks, setIndeks] = useState(0)
  const lebar = useMediaQuery('(min-width: 1024px)')
  const halaman = HALAMAN[indeks]

  const pergi = useCallback((sasaran: number) => {
    setIndeks(Math.min(JUMLAH_HALAMAN - 1, Math.max(0, sasaran)))
  }, [])
  // Kemas kini berfungsi supaya klik pantas berulang dikira dengan tepat.
  const langkah = useCallback((arah: 1 | -1) => {
    setIndeks((i) => Math.min(JUMLAH_HALAMAN - 1, Math.max(0, i + arah)))
  }, [])

  const onKekunci = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      langkah(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      langkah(-1)
    }
  }

  return (
    <section aria-labelledby="tajuk-buku" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28" id="buku">
      <KepalaSeksyen
        id="tajuk-buku"
        label="Paparan Buku Interaktif"
        tajuk={<>{BUKU.tajuk}</>}
        huraian="Selak 12 halaman dengan butang, kekunci anak panah, ketik di tepi halaman atau leret pada skrin sentuh."
      />

      <div
        className="mx-auto max-w-6xl rounded-3xl outline-none"
        tabIndex={0}
        onKeyDown={onKekunci}
        role="region"
        aria-roledescription="buku"
        aria-label={`Paparan buku, ${halaman.label} daripada ${JUMLAH_HALAMAN}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative [perspective:1600px]"
        >
          {/* Cahaya di belakang buku */}
          <div className="pointer-events-none absolute -inset-3 rounded-[3rem] sm:-inset-6 bg-gradient-to-br from-emas-400/20 via-transparent to-zamrud-500/20 blur-3xl" />
          <div className={lebar ? 'px-4 py-4' : 'mx-auto max-w-md py-3 pr-3 pl-5'}>
            <BukuSelak
              indeks={indeks}
              mod={lebar ? 'hamparan' : 'tunggal'}
              konteks="baca"
              tempohMs={lebar ? 780 : 680}
              onNavigasi={langkah}
              className={lebar ? 'aspect-[8/3] w-full' : 'aspect-[4/5] w-full'}
            />
          </div>
        </motion.div>

        {/* Kawalan */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center gap-3 sm:gap-5">
          <button type="button" className="butang-hantu shrink-0" onClick={() => langkah(-1)} disabled={indeks === 0}>
            <IkonKiri /> <span className="hidden sm:inline">Sebelumnya</span>
            <span className="sr-only sm:hidden">Sebelumnya</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-center text-sm text-slate-400 tabular-nums" aria-live="polite">
              <span className="font-display text-xl text-white">{String(indeks + 1).padStart(2, '0')}</span> /{' '}
              {JUMLAH_HALAMAN}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-zamrud-400 to-emas-400"
                animate={{ width: `${((indeks + 1) / JUMLAH_HALAMAN) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          <button
            type="button"
            className="butang-emas shrink-0"
            onClick={() => langkah(1)}
            disabled={indeks === JUMLAH_HALAMAN - 1}
          >
            <span className="hidden sm:inline">Seterusnya</span>
            <span className="sr-only sm:hidden">Seterusnya</span> <IkonKanan />
          </button>
        </div>

        {/* Lakaran kecil */}
        <nav aria-label="Pilih halaman" className="mt-8">
          <ol className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {HALAMAN.map((h, i) => (
              <li key={h.nombor}>
                <button
                  type="button"
                  onClick={() => pergi(i)}
                  aria-label={`Pergi ke ${h.label}`}
                  aria-current={i === indeks ? 'page' : undefined}
                  className={`relative block aspect-[4/3] w-full overflow-hidden rounded-lg border transition ${
                    i === indeks
                      ? 'border-emas-400 ring-2 ring-emas-400/40'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImejHalaman halaman={h} saiz="kecil" className="h-full w-full" />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}
