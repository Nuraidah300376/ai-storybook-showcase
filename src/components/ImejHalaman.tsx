import { useState } from 'react'
import { HALAMAN, calonImej, namaFailImej, type Halaman } from '../data/buku'
import { IkonImej } from './Ikon'

/**
 * Cache peringkat modul: nombor halaman → URL imej yang berjaya dimuat,
 * atau `null` jika tiada fail ditemui. Mengelakkan cubaan berulang.
 */
const cache = new Map<number, string | null>()

/**
 * Kenal pasti imej semua halaman lebih awal, supaya muka halaman yang muncul
 * semasa animasi selak terus memaparkan imej tanpa kelipan placeholder.
 */
export function pramuatImej() {
  for (const h of HALAMAN) {
    if (cache.has(h.nombor)) continue
    const calon = calonImej(h.nombor)
    const cuba = (i: number) => {
      if (cache.has(h.nombor)) return
      if (i >= calon.length) {
        cache.set(h.nombor, null)
        return
      }
      const img = new Image()
      img.onload = () => cache.set(h.nombor, calon[i])
      img.onerror = () => cuba(i + 1)
      img.src = calon[i]
    }
    cuba(0)
  }
}

interface Props {
  halaman: Halaman
  /** Saiz teks placeholder. */
  saiz?: 'kecil' | 'besar'
  className?: string
}

export function ImejHalaman(props: Props) {
  // Kunci mengikut nombor halaman supaya keadaan cubaan direset apabila halaman bertukar.
  return <ImejHalamanDalaman key={props.halaman.nombor} {...props} />
}

function ImejHalamanDalaman({ halaman, saiz = 'besar', className = '' }: Props) {
  const calon = calonImej(halaman.nombor)
  const dicache = cache.get(halaman.nombor)
  const [cubaan, setCubaan] = useState(() => (dicache ? calon.indexOf(dicache) : dicache === null ? calon.length : 0))
  // Jika imej sudah dikenal pasti, paparkan terus (tanpa pudar) — penting semasa selakan.
  const [dimuat, setDimuat] = useState(Boolean(dicache))

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
            cache.set(halaman.nombor, src)
            setDimuat(true)
          }}
          onError={() => {
            const seterusnya = cubaan + 1
            if (seterusnya >= calon.length) cache.set(halaman.nombor, null)
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
          <span className="text-sm font-semibold tracking-[0.2em] text-slate-200 uppercase sm:text-base">{halaman.label}</span>
        )}
        {besar && (
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-zamrud-400/30 bg-zamrud-500/10 px-3 py-1 text-xs text-zamrud-300">
              <IkonImej /> Placeholder imej
            </span>
            <code className="text-[0.7rem] text-slate-400 sm:text-xs">
              public/halaman/{namaFailImej(halaman.nombor)}.webp | .jpg | .png
            </code>
          </>
        )}
      </div>
    </div>
  )
}
