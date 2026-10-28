import { memo } from 'react'
import { BUKU, HALAMAN, JUMLAH_HALAMAN } from '../../data/buku'
import { halamanPadaMuka, type ModBuku, type Muka } from '../../lib/selak'
import { IkonBuku } from '../Ikon'
import { ImejHalaman } from '../ImejHalaman'

interface Props {
  muka: Muka
  mod: ModBuku
}

/**
 * Satu muka kertas. Dimemokan kerana dilukis berulang kali semasa animasi.
 *
 * Muka halaman memaparkan imej A5 penuh tanpa dipotong. Teks cerita sudah
 * terkandung dalam imej, jadi tiada teks tambahan dilukis di atasnya.
 */
export const MukaHalaman = memo(function MukaHalaman({ muka, mod }: Props) {
  // Tulang buku: kiri untuk muka kanan/penuh, kanan untuk muka kiri.
  const tulang = muka.sisi === 'kiri' ? 'kanan' : muka.sisi === 'belakang' ? 'tiada' : 'kiri'
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,var(--color-navy-800),var(--color-navy-900)_55%,#0b1734)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(227,182,74,0.08),transparent_50%),radial-gradient(circle_at_85%_95%,rgba(31,163,122,0.08),transparent_50%)]" />
      <Isi muka={muka} mod={mod} />
      {/* Bayang lurah tulang buku yang sangat halus, supaya warna ilustrasi kekal. */}
      {tulang === 'kiri' && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/25 to-transparent" />
      )}
      {tulang === 'kanan' && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-black/25 to-transparent" />
      )}
    </div>
  )
})

function Isi({ muka, mod }: Props) {
  const indeks = halamanPadaMuka(muka)

  if (indeks === null) {
    return <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.015)_0_6px,transparent_6px_12px)]" />
  }

  if (indeks < 0) {
    return muka.sisi === 'kiri' ? <KertasHujung /> : <HalamanJudul mod={mod} />
  }

  // Bilangan halaman ganjil: muka kanan terakhir menjadi kertas hujung.
  if (indeks >= JUMLAH_HALAMAN) return <KertasHujung />

  return <ImejHalaman halaman={HALAMAN[indeks]} className="h-full w-full" />
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
