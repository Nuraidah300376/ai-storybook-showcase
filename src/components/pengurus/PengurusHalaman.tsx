import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { HALAMAN, JUMLAH_HALAMAN, type Halaman } from '../../data/buku'
import { buangImej, buangSemuaImej, mulakanStor, useStorImej, type ImejDimuatNaik } from '../../lib/storImej'
import { SAIZ_MAKS_MB, TERIMA_FAIL, bukanA5, formatSaiz } from '../../lib/susunFail'
import { eksportPakej, muatNaikFail, muatTurun, type FailMasuk, type Mesej } from '../../lib/urusHalaman'
import { IkonAmaran, IkonGanti, IkonMata, IkonMuatNaik, IkonMuatTurun, IkonPakej, IkonTanda, IkonTong } from '../Ikon'
import { ImejHalaman, useImejAsal } from '../ImejHalaman'
import { KepalaSeksyen } from '../KepalaSeksyen'
import { LabelSumber } from './LabelSumber'
import { PratontonHalaman } from './PratontonHalaman'
import { StatusStoran } from './StatusStoran'

const NAMA_PAKEJ = 'amanah-kecil-hati-besar-halaman.zip'

function keFailMasuk(senarai: FileList | File[]): FailMasuk[] {
  return Array.from(senarai, (f) => ({ nama: f.name, jenis: f.type, blob: f }))
}

interface Props {
  /** Lompat ke halaman dalam Paparan Buku. */
  onLihatDalamBuku: (indeks: number) => void
}

export function PengurusHalaman({ onLihatDalamBuku }: Props) {
  const stor = useStorImej()
  const [asalWujud, setAsalWujud] = useState<ReadonlySet<number>>(() => new Set())
  const [sibuk, setSibuk] = useState<string | null>(null)
  const [mesej, setMesej] = useState<Mesej[]>([])
  const [pratonton, setPratonton] = useState<number | null>(null)
  const [seret, setSeret] = useState(false)
  const inputBerbilang = useRef<HTMLInputElement>(null)
  const inputSlot = useRef<HTMLInputElement>(null)
  const inputPakej = useRef<HTMLInputElement>(null)
  const slotSasaran = useRef<number | null>(null)

  useEffect(() => void mulakanStor(), [])

  const laporAsal = useCallback((nombor: number, wujud: boolean) => {
    setAsalWujud((s) => {
      if (s.has(nombor) === wujud) return s
      const baharu = new Set(s)
      if (wujud) baharu.add(nombor)
      else baharu.delete(nombor)
      return baharu
    })
  }, [])

  const berisi = useMemo(() => {
    const s = new Set(asalWujud)
    for (const n of Object.keys(stor.imej)) s.add(Number(n))
    return s
  }, [asalWujud, stor.imej])
  const bilanganDimuatNaik = Object.keys(stor.imej).length

  const jalankan = useCallback(async (label: string, kerja: () => Promise<Mesej[]>) => {
    setSibuk(label)
    try {
      setMesej(await kerja())
    } catch {
      setMesej([{ jenis: 'ralat', teks: 'Berlaku ralat yang tidak dijangka. Sila cuba lagi.' }])
    } finally {
      setSibuk(null)
    }
  }, [])

  const muatNaik = useCallback(
    (fail: FailMasuk[], slot?: number) => {
      if (!fail.length) return
      void jalankan(fail.length > 1 ? `Memproses ${fail.length} fail…` : 'Memproses fail…', () => muatNaikFail(fail, berisi, slot))
    },
    [berisi, jalankan],
  )

  const pilihUntukSlot = (nombor: number) => {
    slotSasaran.current = nombor
    inputSlot.current?.click()
  }

  const eksport = () =>
    void jalankan('Menyediakan pakej…', async () => {
      const hasil = await eksportPakej(asalWujud)
      if (!hasil) return [{ jenis: 'ralat', teks: 'Tiada imej untuk dieksport.' }]
      muatTurun(hasil.zip, NAMA_PAKEJ)
      return [
        {
          jenis: 'berjaya',
          teks: `Pakej ${NAMA_PAKEJ} (${hasil.bilangan} imej, ${formatSaiz(hasil.zip.size)}) dimuat turun. Simpan fail ini sebagai sandaran.`,
        },
      ]
    })

  const buangSemua = () => {
    if (!window.confirm(`Buang semua ${bilanganDimuatNaik} imej yang dimuat naik daripada pelayar ini? Tindakan ini tidak boleh dibatalkan.`)) return
    void jalankan('Membuang…', async () => {
      await buangSemuaImej()
      return [{ jenis: 'berjaya', teks: 'Semua imej yang dimuat naik telah dibuang daripada storan pelayar.' }]
    })
  }

  const onLepas = (e: DragEvent) => {
    e.preventDefault()
    setSeret(false)
    muatNaik(keFailMasuk(e.dataTransfer.files))
  }

  return (
    <section id="pengurus" aria-labelledby="tajuk-pengurus" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <KepalaSeksyen
        id="tajuk-pengurus"
        label="Pengurus Halaman Buku"
        tajuk={
          <>
            Urus <span className="teks-emas">12 imej halaman</span> buku
          </>
        }
        huraian="Muat naik, ganti dan pratonton imej halaman A5 terus di sini. Imej menggantikan placeholder secara automatik dalam paparan buku dan mod persembahan."
      />

      <div className="mx-auto max-w-6xl space-y-5">
        {/* Zon muat naik berbilang fail */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setSeret(true)
            }}
            onDragLeave={() => setSeret(false)}
            onDrop={onLepas}
            className={`kaca flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition sm:p-8 ${
              seret ? 'border-emas-400 bg-emas-400/10' : 'border-emas-400/30'
            }`}
          >
            <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-emas-300 to-emas-500 text-2xl text-navy-950">
              <IkonMuatNaik />
            </span>
            <p className="mt-4 font-semibold text-white">Seret dan lepas imej halaman di sini</p>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              Pilih 1 hingga 12 fail sekali gus. Fail disusun secara automatik mengikut nombor dalam nama fail, contohnya{' '}
              <code className="text-emas-200">halaman-01.png</code> hingga <code className="text-emas-200">halaman-12.png</code>.
            </p>
            <button type="button" className="butang-emas mt-5" onClick={() => inputBerbilang.current?.click()} disabled={!!sibuk}>
              <IkonMuatNaik /> Pilih Imej
            </button>
            <p className="mt-3 text-xs text-slate-500">
              PNG, JPG, JPEG atau WebP · maksimum {SAIZ_MAKS_MB} MB setiap fail · disyorkan A5 potret (contoh 1748×2480 piksel)
            </p>
          </div>

          <div className="kaca flex flex-col rounded-3xl p-6">
            <p className="text-sm font-semibold text-zamrud-300">Ringkasan</p>
            <p className="mt-3 font-display text-4xl text-white tabular-nums">
              {berisi.size}
              <span className="text-xl text-slate-400"> / {JUMLAH_HALAMAN}</span>
            </p>
            <p className="text-sm text-slate-400">halaman berimej</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-zamrud-400 to-emas-400 transition-[width] duration-500"
                style={{ width: `${(berisi.size / JUMLAH_HALAMAN) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {bilanganDimuatNaik} dimuat naik dalam pelayar ini · {asalWujud.size} fail kekal dalam public/halaman
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <button type="button" className="butang-zamrud flex-1" onClick={eksport} disabled={!!sibuk || berisi.size === 0}>
                <IkonMuatTurun /> Eksport Pakej
              </button>
              <button type="button" className="butang-hantu flex-1" onClick={() => inputPakej.current?.click()} disabled={!!sibuk}>
                <IkonPakej /> Import Pakej
              </button>
              <button
                type="button"
                className="butang-hantu w-full text-rose-200 hover:border-rose-400/60"
                onClick={buangSemua}
                disabled={!!sibuk || bilanganDimuatNaik === 0}
              >
                <IkonTong /> Buang Semua Muat Naik
              </button>
            </div>
          </div>
        </div>

        <PapanMesej sibuk={sibuk} mesej={mesej} onTutup={() => setMesej([])} />

        {/* 12 slot */}
        <ol aria-label="Slot imej halaman" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {HALAMAN.map((h, i) => (
            <SlotHalaman
              key={h.nombor}
              halaman={h}
              dimuatNaik={stor.imej[h.nombor]}
              sibuk={!!sibuk}
              onLaporAsal={laporAsal}
              onPilih={() => pilihUntukSlot(h.nombor)}
              onLepas={(fail) => muatNaik(fail.slice(0, 1), h.nombor)}
              onPratonton={() => setPratonton(i)}
              onBuang={() =>
                void jalankan('Membuang…', async () => {
                  await buangImej(h.nombor)
                  return [{ jenis: 'berjaya', teks: `Imej muat naik ${h.label} dibuang.` }]
                })
              }
            />
          ))}
        </ol>

        <StatusStoran mod={stor.mod} bilangan={bilanganDimuatNaik} />
      </div>

      <input
        ref={inputBerbilang}
        type="file"
        accept={`${TERIMA_FAIL},.zip`}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) muatNaik(keFailMasuk(e.target.files))
          e.target.value = ''
        }}
      />
      <input
        ref={inputSlot}
        type="file"
        accept={TERIMA_FAIL}
        hidden
        onChange={(e) => {
          const slot = slotSasaran.current
          if (e.target.files && slot) muatNaik(keFailMasuk(e.target.files), slot)
          e.target.value = ''
        }}
      />
      <input
        ref={inputPakej}
        type="file"
        accept=".zip,application/zip"
        hidden
        onChange={(e) => {
          if (e.target.files) muatNaik(keFailMasuk(e.target.files))
          e.target.value = ''
        }}
      />

      <AnimatePresence>
        {pratonton !== null && (
          <PratontonHalaman
            indeks={pratonton}
            onTukar={setPratonton}
            onTutup={() => setPratonton(null)}
            onLihatDalamBuku={(i) => {
              setPratonton(null)
              onLihatDalamBuku(i)
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function PapanMesej({ sibuk, mesej, onTutup }: { sibuk: string | null; mesej: Mesej[]; onTutup: () => void }) {
  if (!sibuk && !mesej.length) return <div aria-live="polite" className="sr-only" />
  const ikon: Record<Mesej['jenis'], ReactNode> = {
    berjaya: <IkonTanda className="mt-0.5 shrink-0 text-zamrud-300" />,
    amaran: <IkonAmaran className="mt-0.5 shrink-0 text-emas-300" />,
    ralat: <IkonAmaran className="mt-0.5 shrink-0 text-rose-300" />,
  }
  return (
    <div aria-live="polite" className="kaca rounded-2xl p-4 text-sm">
      {sibuk ? (
        <p className="flex items-center gap-2 text-slate-200">
          <span className="size-4 animate-spin rounded-full border-2 border-emas-300 border-t-transparent" /> {sibuk}
        </p>
      ) : (
        <div className="flex items-start gap-3">
          <ul className="min-w-0 flex-1 space-y-1.5">
            {mesej.map((m, i) => (
              <li key={i} className="flex gap-2 break-words text-slate-300">
                {ikon[m.jenis]}
                <span className="min-w-0">{m.teks}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onTutup} className="shrink-0 text-xs text-slate-400 underline hover:text-white">
            Tutup
          </button>
        </div>
      )}
    </div>
  )
}

interface SlotProps {
  halaman: Halaman
  dimuatNaik: ImejDimuatNaik | undefined
  sibuk: boolean
  onLaporAsal: (nombor: number, wujud: boolean) => void
  onPilih: () => void
  onLepas: (fail: FailMasuk[]) => void
  onPratonton: () => void
  onBuang: () => void
}

function SlotHalaman({ halaman, dimuatNaik, sibuk, onLaporAsal, onPilih, onLepas, onPratonton, onBuang }: SlotProps) {
  const asal = useImejAsal(halaman.nombor)
  const [seret, setSeret] = useState(false)
  const berimej = Boolean(dimuatNaik || asal)

  useEffect(() => {
    if (asal !== undefined) onLaporAsal(halaman.nombor, asal !== null)
  }, [asal, halaman.nombor, onLaporAsal])

  return (
    <li
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSeret(true)
      }}
      onDragLeave={() => setSeret(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSeret(false)
        onLepas(keFailMasuk(e.dataTransfer.files))
      }}
      className={`kaca flex min-w-0 flex-col rounded-2xl p-2.5 transition sm:p-3 ${seret ? 'border-emas-400 bg-emas-400/10' : ''}`}
    >
      <button
        type="button"
        onClick={onPratonton}
        aria-label={`Pratonton ${halaman.label}`}
        className="group relative block aspect-[148/210] w-full overflow-hidden rounded-lg bg-navy-900 ring-1 ring-white/10"
      >
        <ImejHalaman halaman={halaman} saiz="kecil" className="h-full w-full" />
        <span className="absolute inset-0 grid place-items-center bg-navy-950/60 text-2xl text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <IkonMata />
        </span>
      </button>

      <p className="mt-2.5 text-sm font-semibold text-white">{halaman.label}</p>
      <div className="mt-0.5 text-[0.7rem] leading-snug">
        <LabelSumber dimuatNaik={dimuatNaik} asal={asal} />
      </div>
      {dimuatNaik && (
        <p className="mt-1 truncate text-[0.7rem] text-slate-500" title={dimuatNaik.nama}>
          {dimuatNaik.nama} · {formatSaiz(dimuatNaik.saiz)}
        </p>
      )}
      {dimuatNaik && bukanA5(dimuatNaik.lebar, dimuatNaik.tinggi) && (
        <p className="mt-1 flex items-center gap-1 text-[0.7rem] text-emas-300">
          <IkonAmaran className="shrink-0" /> Bukan nisbah A5
        </p>
      )}

      <div className="mt-auto grid gap-1.5 pt-3">
        {berimej ? (
          <button type="button" className="butang-hantu min-h-9 px-2 text-xs" onClick={onPilih} disabled={sibuk}>
            <IkonGanti /> Ganti Gambar
          </button>
        ) : (
          <button type="button" className="butang-emas min-h-9 px-2 text-xs" onClick={onPilih} disabled={sibuk}>
            <IkonMuatNaik /> Muat Naik
          </button>
        )}
        <div className="flex gap-1.5">
          <button type="button" className="butang-hantu min-h-9 flex-1 px-2 text-xs" onClick={onPratonton}>
            <IkonMata /> Pratonton
          </button>
          {dimuatNaik && (
            <button
              type="button"
              className="butang-hantu min-h-9 px-2.5 text-xs hover:border-rose-400/60"
              onClick={onBuang}
              disabled={sibuk}
              aria-label={`Buang imej muat naik ${halaman.label}`}
              title={asal ? 'Buang muat naik (kembali ke fail public/halaman)' : 'Buang muat naik'}
            >
              <IkonTong />
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
