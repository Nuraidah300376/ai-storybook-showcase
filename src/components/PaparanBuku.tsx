import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useCallback, useState, type KeyboardEvent } from 'react'
import { BUKU, HALAMAN, JUMLAH_HALAMAN } from '../data/buku'
import { IkonKanan, IkonKiri } from './Ikon'
import { ImejHalaman } from './ImejHalaman'
import { KepalaSeksyen } from './KepalaSeksyen'

const selak = {
  masuk: (arah: number) => ({ opacity: 0, rotateY: arah * 28, x: arah * 60, scale: 0.96 }),
  tengah: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
  keluar: (arah: number) => ({ opacity: 0, rotateY: arah * -28, x: arah * -60, scale: 0.96 }),
}

export function PaparanBuku() {
  const [[indeks, arah], setHalaman] = useState<[number, number]>([0, 0])
  const halaman = HALAMAN[indeks]

  const pergi = useCallback((sasaran: number) => {
    setHalaman(([semasa]) => {
      const baru = Math.min(JUMLAH_HALAMAN - 1, Math.max(0, sasaran))
      return baru === semasa ? [semasa, 0] : [baru, baru > semasa ? 1 : -1]
    })
  }, [])

  const onKekunci = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      pergi(indeks + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      pergi(indeks - 1)
    }
  }

  const onSeret = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) pergi(indeks + 1)
    else if (info.offset.x > 60) pergi(indeks - 1)
  }

  return (
    <section aria-labelledby="tajuk-buku" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28" id="buku">
      <KepalaSeksyen
        id="tajuk-buku"
        label="Paparan Buku Interaktif"
        tajuk={<>{BUKU.tajuk}</>}
        huraian="Selak 12 halaman menggunakan butang, kekunci anak panah atau leretan pada skrin sentuh."
      />

      <div
        className="mx-auto max-w-6xl outline-none"
        tabIndex={0}
        onKeyDown={onKekunci}
        role="region"
        aria-roledescription="buku"
        aria-label={`Paparan buku, ${halaman.label} daripada ${JUMLAH_HALAMAN}`}
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.45fr_1fr]">
          {/* Halaman (imej) */}
          <div className="relative [perspective:1600px]">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-emas-400/25 via-transparent to-zamrud-500/25 blur-2xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-emas-400/25 bg-navy-900 shadow-2xl shadow-black/50">
              <AnimatePresence initial={false} custom={arah} mode="popLayout">
                <motion.div
                  key={indeks}
                  custom={arah}
                  variants={selak}
                  initial="masuk"
                  animate="tengah"
                  exit="keluar"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={onSeret}
                  className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <ImejHalaman halaman={halaman} className="h-full w-full rounded-[inherit]" />
                </motion.div>
              </AnimatePresence>
              {/* Tulang buku */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/40 to-transparent" />
            </div>
          </div>

          {/* Panel teks */}
          <div className="kaca flex flex-col rounded-[1.5rem] p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label-seksyen">{halaman.label}</p>
              <p className="text-sm text-slate-400 tabular-nums" aria-live="polite">
                <span className="font-display text-2xl text-white">{String(indeks + 1).padStart(2, '0')}</span> /{' '}
                {JUMLAH_HALAMAN}
              </p>
            </div>

            <div className="mt-6 min-h-32 flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={indeks}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  {halaman.teks ? (
                    <p className="font-display text-xl leading-relaxed text-slate-100 sm:text-2xl">{halaman.teks}</p>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-400">
                      <p className="font-semibold text-slate-300">Teks cerita belum dimasukkan.</p>
                      <p className="mt-1">
                        Kemas kini medan <code className="text-emas-300">teks</code> bagi halaman ini dalam{' '}
                        <code className="text-emas-300">src/data/buku.ts</code>.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-zamrud-400 to-emas-400"
                animate={{ width: `${((indeks + 1) / JUMLAH_HALAMAN) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="butang-hantu" onClick={() => pergi(indeks - 1)} disabled={indeks === 0}>
                <IkonKiri /> Sebelumnya
              </button>
              <button
                type="button"
                className="butang-emas"
                onClick={() => pergi(indeks + 1)}
                disabled={indeks === JUMLAH_HALAMAN - 1}
              >
                Seterusnya <IkonKanan />
              </button>
            </div>
          </div>
        </div>

        {/* Lakaran kecil */}
        <nav aria-label="Pilih halaman" className="mt-6">
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
