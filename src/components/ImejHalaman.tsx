import { useState, useSyncExternalStore } from 'react'
import { HALAMAN, calonImej, namaFailImej, type Halaman } from '../data/buku'
import { useImejDimuatNaik, useStorImej } from '../lib/storImej'
import { IkonImej } from './Ikon'

/**
 * Cache peringkat modul bagi fail dalam `public/halaman/`: nombor halaman →
 * URL imej yang berjaya dimuat, atau `null` jika tiada fail ditemui.
 * Mengelakkan cubaan berulang dan memaklumkan Pengurus Halaman Buku.
 */
const cache = new Map<number, string | null>()
const pendengar = new Set<() => void>()

function tetapkanCache(nombor: number, url: string | null) {
  if (cache.get(nombor) === url) return
  cache.set(nombor, url)
  for (const p of pendengar) p()
}

function langgan(p: () => void) {
  pendengar.add(p)
  return () => pendengar.delete(p)
}

/**
 * Fail asal dalam `public/halaman/` bagi satu halaman:
 * URL jika wujud, `null` jika tiada, `undefined` jika belum disemak.
 */
export function useImejAsal(nombor: number): string | null | undefined {
  return useSyncExternalStore(
    langgan,
    () => cache.get(nombor),
    () => cache.get(nombor),
  )
}

/** Bilangan halaman yang imejnya sudah berjaya dimuat (dimuat naik atau fail public/halaman/). */
export function useBilanganImejSedia(): number {
  const { imej } = useStorImej()
  const asal = useSyncExternalStore(langgan, senaraiAsalSedia, senaraiAsalSedia)
  const sedia = new Set(asal ? asal.split(',').map(Number) : [])
  return HALAMAN.filter((h) => imej[h.nombor] || sedia.has(h.nombor)).length
}

/** Rentetan stabil (untuk useSyncExternalStore) bagi nombor halaman dengan fail asal yang dimuat. */
function senaraiAsalSedia(): string {
  return HALAMAN.filter((h) => cache.get(h.nombor))
    .map((h) => h.nombor)
    .join(',')
}

/**
 * Kenal pasti imej semua halaman lebih awal, supaya muka halaman yang muncul
 * semasa animasi selak terus memaparkan imej tanpa kelipan placeholder.
 * Selesai apabila setiap halaman sudah disemak (imej ditemui atau tiada).
 */
export function pramuatImej(): Promise<void> {
  const semua = HALAMAN.map(
    (h) =>
      new Promise<void>((selesai) => {
        if (cache.has(h.nombor)) return selesai()
        const calon = calonImej(h.nombor)
        const cuba = (i: number) => {
          if (cache.has(h.nombor)) return selesai()
          if (i >= calon.length) {
            tetapkanCache(h.nombor, null)
            return selesai()
          }
          const img = new Image()
          img.onload = () => {
            tetapkanCache(h.nombor, calon[i])
            selesai()
          }
          img.onerror = () => cuba(i + 1)
          img.src = calon[i]
        }
        cuba(0)
      }),
  )
  return Promise.all(semua).then(() => {})
}

/** URL fail `public/halaman/` yang berjaya dimuat (selepas `pramuatImej`). */
export function urlImejAsal(): string[] {
  return HALAMAN.flatMap((h) => cache.get(h.nombor) ?? [])
}

interface Props {
  halaman: Halaman
  /** Saiz teks placeholder. */
  saiz?: 'kecil' | 'besar'
  className?: string
}

/**
 * Imej satu halaman, dipaparkan penuh tanpa dipotong (object-contain).
 *
 * Keutamaan sumber: imej dimuat naik (Pengurus Halaman Buku) → fail dalam
 * `public/halaman/` → placeholder berlabel.
 */
export function ImejHalaman(props: Props) {
  const dimuatNaik = useImejDimuatNaik(props.halaman.nombor)
  // Kunci mengikut sumber supaya keadaan cubaan direset apabila halaman atau imej bertukar.
  if (dimuatNaik) return <ImejHalamanDalaman key={dimuatNaik.url} {...props} calon={[dimuatNaik.url]} dimuatAwal />
  return <ImejHalamanAsal key={props.halaman.nombor} {...props} />
}

function ImejHalamanAsal(props: Props) {
  const calon = calonImej(props.halaman.nombor)
  const dicache = cache.get(props.halaman.nombor)
  return (
    <ImejHalamanDalaman
      {...props}
      asal
      calon={calon}
      cubaanAwal={dicache ? calon.indexOf(dicache) : dicache === null ? calon.length : 0}
      // Jika imej sudah dikenal pasti, paparkan terus (tanpa pudar) — penting semasa selakan.
      dimuatAwal={Boolean(dicache)}
    />
  )
}

function ImejHalamanDalaman({
  halaman,
  saiz = 'besar',
  className = '',
  calon,
  cubaanAwal = 0,
  dimuatAwal,
  asal = false,
}: Props & {
  calon: string[]
  cubaanAwal?: number
  dimuatAwal: boolean
  /** Benar jika calon ialah fail dalam public/halaman/ (hasil cubaan dicache). */
  asal?: boolean
}) {
  const [cubaan, setCubaan] = useState(cubaanAwal)
  const [dimuat, setDimuat] = useState(dimuatAwal)

  const src = cubaan < calon.length ? calon[cubaan] : null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <PlaceholderHalaman halaman={halaman} saiz={saiz} tersembunyi={dimuat} />
      {src && (
        <img
          key={src}
          src={src}
          alt={halaman.alt}
          draggable={false}
          onLoad={() => {
            if (asal) tetapkanCache(halaman.nombor, src)
            setDimuat(true)
          }}
          onError={() => {
            const seterusnya = cubaan + 1
            if (asal && seterusnya >= calon.length) tetapkanCache(halaman.nombor, null)
            setDimuat(false)
            setCubaan(seterusnya)
          }}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-out ${
            dimuat ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

function PlaceholderHalaman({
  halaman,
  saiz,
  tersembunyi,
}: {
  halaman: Halaman
  saiz: 'kecil' | 'besar'
  tersembunyi: boolean
}) {
  const besar = saiz === 'besar'
  return (
    <div
      aria-hidden={tersembunyi}
      role={tersembunyi ? undefined : 'img'}
      aria-label={tersembunyi ? undefined : `Placeholder ${halaman.label}: imej belum dimasukkan`}
      className={`@container absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-center transition-opacity duration-700 ${
        tersembunyi ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {besar && <div className="absolute inset-[4%] rounded-[inherit] border border-dashed border-emas-400/35" />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(227,182,74,0.12),transparent_55%),radial-gradient(circle_at_75%_85%,rgba(31,163,122,0.14),transparent_55%)]" />
      <div className="relative flex flex-col items-center gap-[0.6em] px-[8%]">
        <span
          className={`font-display leading-none font-bold text-emas-300/90 ${
            besar ? '[font-size:clamp(2rem,22cqw,7rem)]' : '[font-size:clamp(0.75rem,38cqw,2rem)]'
          }`}
        >
          {String(halaman.nombor).padStart(2, '0')}
        </span>
        {besar && (
          <span className="[font-size:clamp(0.6rem,5cqw,1rem)] font-semibold tracking-[0.2em] text-slate-200 uppercase">
            {halaman.label}
          </span>
        )}
        {besar && (
          <>
            <span className="inline-flex items-center gap-[0.5em] rounded-full border border-zamrud-400/30 bg-zamrud-500/10 px-[0.9em] py-[0.3em] [font-size:clamp(0.55rem,4cqw,0.75rem)] text-zamrud-300">
              <IkonImej /> Placeholder imej
            </span>
            <span className="[font-size:clamp(0.5rem,3.6cqw,0.75rem)] leading-snug text-slate-400">
              Muat naik di <span className="text-emas-200">Pengurus Halaman Buku</span>
              <br />
              atau letak <code className="text-slate-300">public/halaman/{namaFailImej(halaman.nombor)}.png</code>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
