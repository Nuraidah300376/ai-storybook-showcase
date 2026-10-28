import { BUKU } from '../data/buku'
import { IkonBintang } from './Ikon'

export function Kredit() {
  const tahun = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 px-4 py-14 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="label-seksyen">
          <IkonBintang /> Kredit <IkonBintang />
        </p>
        <dl className="grid gap-6 sm:grid-cols-2 sm:gap-16">
          <div>
            <dt className="text-xs tracking-[0.2em] text-slate-500 uppercase">Penulis Buku</dt>
            <dd className="mt-1 font-display text-xl text-white">{BUKU.penulis}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.2em] text-slate-500 uppercase">Pembangun</dt>
            <dd className="mt-1 font-display text-xl text-emas-300">{BUKU.pembangun}</dd>
          </div>
        </dl>
        <p className="max-w-xl text-sm text-slate-500">
          AI Storybook Showcase · {BUKU.tajuk} · © {tahun} {BUKU.pembangun}
        </p>
      </div>
    </footer>
  )
}
