import { motion } from 'motion/react'
import { useCallback, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import { BUKU, HALAMAN, JUMLAH_HALAMAN } from '../data/buku'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { hamparanBagi } from '../lib/selak'
import { BukuSelak } from './buku/BukuSelak'
import { IkonKanan, IkonKiri } from './Ikon'
import { ImejHalaman } from './ImejHalaman'
import { KepalaSeksyen } from './KepalaSeksyen'

const had = (i: number) => Math.min(JUMLAH_HALAMAN - 1, Math.max(0, i))
const dua = (n: number) => String(n).padStart(2, '0')

interface Props {
  /** Halaman semasa (0..11), dikawal oleh App supaya Pengurus Halaman Buku boleh melompat ke sini. */
  indeks: number
  setIndeks: Dispatch<SetStateAction<number>>
}

export function PaparanBuku({ indeks, setIndeks }: Props) {
  const lebar = useMediaQuery('(min-width: 1024px)')
  // Komputer: hamparan dua halaman (1–2, 3–4, …), maka navigasi melangkah dua halaman.
  const kiri = lebar ? hamparanBagi(indeks) * 2 : indeks
  const kanan = lebar ? Math.min(kiri + 1, JUMLAH_HALAMAN - 1) : indeks
  const label = kiri === kanan ? HALAMAN[kiri].label : `Halaman ${dua(kiri + 1)}–${dua(kanan + 1)}`

  const pergi = useCallback((sasaran: number) => setIndeks(had(sasaran)), [setIndeks])
  // Kemas kini berfungsi supaya klik pantas berulang dikira dengan tepat.
  const langkah = useCallback(
    (arah: 1 | -1) =>
      setIndeks((i) => {
        if (!lebar) return had(i + arah)
        const s = hamparanBagi(i) + arah
        return s < 0 || s * 2 >= JUMLAH_HALAMAN ? i : s * 2
      }),
    [lebar, setIndeks],
  )

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
        huraian="Selak 12 halaman A5 dengan butang, kekunci anak panah, ketik di tepi halaman atau leret pada skrin sentuh. Komputer memaparkan dua halaman sekali gus."
      />

      <div
        className="mx-auto max-w-6xl rounded-3xl outline-none"
        tabIndex={0}
        onKeyDown={onKekunci}
        role="region"
        aria-roledescription="buku"
        aria-label={`Paparan buku, ${label} daripada ${JUMLAH_HALAMAN}`}
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
          {/* Lebar dihadkan oleh tinggi skrin supaya halaman A5 dipaparkan penuh tanpa perlu menatal. */}
          <div
            className={
              lebar
                ? 'mx-auto w-full max-w-[min(100%,calc((100svh-15rem)*296/210))] p-4'
                : 'mx-auto w-full max-w-[min(26rem,calc((100svh-13rem)*148/210))] py-3 pr-3 pl-5'
            }
          >
            <BukuSelak
              indeks={indeks}
              mod={lebar ? 'hamparan' : 'tunggal'}
              tempohMs={lebar ? 780 : 680}
              onNavigasi={langkah}
              className={lebar ? 'aspect-[296/210] w-full' : 'aspect-[148/210] w-full'}
            />
          </div>
        </motion.div>

        {/* Kawalan */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center gap-3 sm:gap-5">
          <button type="button" className="butang-hantu shrink-0" onClick={() => langkah(-1)} disabled={kiri === 0}>
            <IkonKiri /> <span className="hidden sm:inline">Sebelumnya</span>
            <span className="sr-only sm:hidden">Sebelumnya</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-center text-sm text-slate-400 tabular-nums" aria-live="polite">
              <span className="sr-only">{label} daripada {JUMLAH_HALAMAN}</span>
              <span aria-hidden="true">
                <span className="font-display text-xl text-white">
                  {dua(kiri + 1)}
                  {kanan !== kiri && `–${dua(kanan + 1)}`}
                </span>{' '}
                / {JUMLAH_HALAMAN}
              </span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-zamrud-400 to-emas-400"
                animate={{ width: `${((kanan + 1) / JUMLAH_HALAMAN) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          <button
            type="button"
            className="butang-emas shrink-0"
            onClick={() => langkah(1)}
            disabled={kanan === JUMLAH_HALAMAN - 1}
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
                  aria-current={i >= kiri && i <= kanan ? 'page' : undefined}
                  className={`relative block aspect-[148/210] w-full overflow-hidden rounded-lg border transition ${
                    i >= kiri && i <= kanan
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
