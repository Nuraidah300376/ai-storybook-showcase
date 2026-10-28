import { memo } from 'react'
import { BUKU, HALAMAN, JUMLAH_HALAMAN } from '../../data/buku'
import type { ModBuku, Muka } from '../../lib/selak'
import { IkonBuku } from '../Ikon'
import { ImejHalaman } from '../ImejHalaman'

export type KonteksBuku = 'baca' | 'persembahan'

/**
 * Saiz teks dalam unit cqw (relatif kepada lebar buku), supaya buku kelihatan
 * sama pada komputer, telefon dan pentas persembahan.
 */
const SAIZ = {
  hamparan: {
    label: 'text-[0.95cqw]',
    tajuk: 'text-[1.5cqw]',
    teks: 'text-[1.75cqw]',
    nota: 'text-[1.1cqw]',
    nombor: 'text-[1cqw]',
    pad: 'p-[2.6cqw]',
  },
  tunggal: {
    label: 'text-[3.1cqw]',
    tajuk: 'text-[4.2cqw]',
    teks: 'text-[4.6cqw]',
    nota: 'text-[3.3cqw]',
    nombor: 'text-[3cqw]',
    pad: 'p-[5cqw]',
  },
} as const

interface Props {
  muka: Muka
  mod: ModBuku
  konteks: KonteksBuku
}

/** Satu muka kertas. Dimemokan kerana dilukis berulang kali semasa animasi. */
export const MukaHalaman = memo(function MukaHalaman({ muka, mod, konteks }: Props) {
  // Tulang buku: kiri untuk muka kanan/penuh, kanan untuk muka kiri.
  const tulang = muka.sisi === 'kiri' ? 'kanan' : muka.sisi === 'belakang' ? 'tiada' : 'kiri'
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,var(--color-navy-800),var(--color-navy-900)_55%,#0b1734)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(227,182,74,0.08),transparent_50%),radial-gradient(circle_at_85%_95%,rgba(31,163,122,0.08),transparent_50%)]" />
      <Isi muka={muka} mod={mod} konteks={konteks} />
      {/* Bayang lurah tulang buku */}
      {tulang === 'kiri' && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      )}
      {tulang === 'kanan' && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-black/45 via-black/10 to-transparent" />
      )}
    </div>
  )
})

function Isi({ muka, mod, konteks }: Props) {
  const z = SAIZ[mod]

  if (muka.sisi === 'belakang') {
    return <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.015)_0_6px,transparent_6px_12px)]" />
  }

  if (muka.indeks < 0) {
    return muka.sisi === 'kiri' ? <KertasHujung /> : <HalamanJudul mod={mod} />
  }

  const halaman = HALAMAN[muka.indeks]
  const nombor = <NomborHalaman n={muka.indeks + 1} kelas={z.nombor} />

  if (muka.sisi === 'kiri') {
    return (
      <div className={`absolute inset-0 flex flex-col ${z.pad} pr-[3.2cqw]`}>
        <ImejHalaman halaman={halaman} className="min-h-0 flex-1 rounded-[0.8cqw] ring-1 ring-emas-400/20" />
        <div className="mt-[1cqw] flex justify-start">{nombor}</div>
      </div>
    )
  }

  if (muka.sisi === 'kanan') {
    return (
      <div className={`absolute inset-0 flex flex-col ${z.pad} pl-[3.6cqw]`}>
        <KepalaTeks indeks={muka.indeks} z={z} />
        <div className="mt-[1.6cqw] min-h-0 flex-1 overflow-hidden">
          <TeksCerita teks={halaman.teks} konteks={konteks} z={z} />
        </div>
        <div className="mt-[1cqw] flex justify-end">{nombor}</div>
      </div>
    )
  }

  // penuh (tunggal): ilustrasi di atas, teks di bawah.
  return (
    <div className={`absolute inset-0 flex flex-col ${z.pad} pl-[7cqw]`}>
      <ImejHalaman halaman={halaman} className="aspect-[4/3] w-full shrink-0 rounded-[2cqw] ring-1 ring-emas-400/20" />
      <div className="mt-[4cqw]">
        <KepalaTeks indeks={muka.indeks} z={z} />
      </div>
      <div className="mt-[3cqw] min-h-0 flex-1 overflow-hidden">
        <TeksCerita teks={halaman.teks} konteks={konteks} z={z} />
      </div>
      <div className="mt-[2cqw] flex justify-center">{nombor}</div>
    </div>
  )
}

type Saiz = (typeof SAIZ)[ModBuku]

function KepalaTeks({ indeks, z }: { indeks: number; z: Saiz }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-[1cqw]">
        <p className={`font-semibold tracking-[0.25em] text-emas-300 uppercase ${z.label}`}>{HALAMAN[indeks].label}</p>
        <p className={`text-slate-400 tabular-nums ${z.label}`}>
          {String(indeks + 1).padStart(2, '0')} / {JUMLAH_HALAMAN}
        </p>
      </div>
      <p className={`font-display mt-[0.4em] text-white/85 italic ${z.tajuk}`}>{BUKU.tajuk}</p>
      <Hiasan />
    </div>
  )
}

function TeksCerita({ teks, konteks, z }: { teks: string | null; konteks: KonteksBuku; z: Saiz }) {
  if (teks) return <p className={`font-display leading-relaxed text-slate-100 ${z.teks}`}>{teks}</p>
  return (
    <div className={`rounded-[0.8em] border border-dashed border-white/15 p-[1em] text-slate-400 ${z.nota}`}>
      <p className="font-semibold text-slate-300">Teks cerita belum dimasukkan.</p>
      {konteks === 'baca' && (
        <p className="mt-[0.3em]">
          Kemas kini medan <code className="text-emas-300">teks</code> dalam{' '}
          <code className="text-emas-300">src/data/buku.ts</code>.
        </p>
      )}
    </div>
  )
}

function Hiasan() {
  return (
    <div aria-hidden="true" className="mt-[0.9em] flex items-center gap-[0.5em] text-emas-400/70">
      <span className="h-px w-[3em] bg-gradient-to-r from-transparent to-emas-400/60" />
      <span className="size-[0.35em] rotate-45 bg-emas-400/80" />
      <span className="h-px w-[3em] bg-gradient-to-l from-transparent to-emas-400/60" />
    </div>
  )
}

function NomborHalaman({ n, kelas }: { n: number; kelas: string }) {
  return <span className={`font-display text-emas-300/80 tabular-nums ${kelas}`}>{n}</span>
}

function HalamanJudul({ mod }: { mod: ModBuku }) {
  const t = mod === 'hamparan'
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center text-center ${t ? 'px-[3cqw]' : 'px-[8cqw]'}`}>
      <div className="absolute inset-[5%] rounded-[1cqw] border border-emas-400/30" />
      <p className={`font-semibold tracking-[0.3em] text-emas-300 uppercase ${t ? 'text-[0.9cqw]' : 'text-[3cqw]'}`}>
        Buku Cerita Bergambar
      </p>
      <p className={`font-display teks-emas mt-[0.4em] leading-tight font-bold ${t ? 'text-[3.4cqw]' : 'text-[10cqw]'}`}>
        {BUKU.tajuk}
      </p>
      <div className={t ? 'text-[1.2cqw]' : 'text-[4cqw]'}>
        <Hiasan />
      </div>
      <p className={`mt-[0.8em] text-slate-300 ${t ? 'text-[1.2cqw]' : 'text-[4cqw]'}`}>
        karya <span className="font-semibold text-zamrud-300">{BUKU.penulis}</span>
      </p>
    </div>
  )
}

function KertasHujung() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(rgba(227,182,74,0.14)_1px,transparent_1.5px)] bg-[size:1.6cqw_1.6cqw]">
      <span className="grid size-[6cqw] place-items-center rounded-full border border-emas-400/40 bg-navy-900/80 text-[2.6cqw] text-emas-300">
        <IkonBuku />
      </span>
    </div>
  )
}
