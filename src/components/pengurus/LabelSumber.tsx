import type { ImejDimuatNaik } from '../../lib/storImej'

interface Props {
  dimuatNaik: ImejDimuatNaik | undefined
  asal: string | null | undefined
}

/** Lencana kecil yang menerangkan dari mana imej halaman diambil. */
export function LabelSumber({ dimuatNaik, asal }: Props) {
  if (dimuatNaik) {
    return dimuatNaik.tersimpan ? (
      <span className="inline-flex items-center gap-1.5 text-emas-300">
        <span className="size-1.5 rounded-full bg-emas-400" /> Dimuat naik · storan pelayar
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-rose-300">
        <span className="size-1.5 rounded-full bg-rose-400" /> Dimuat naik · sesi sahaja
      </span>
    )
  }
  if (asal) {
    return (
      <span className="inline-flex items-center gap-1.5 text-zamrud-300">
        <span className="size-1.5 rounded-full bg-zamrud-400" /> Fail kekal · public/halaman
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-400">
      <span className="size-1.5 rounded-full bg-slate-500" /> {asal === undefined ? 'Menyemak…' : 'Placeholder'}
    </span>
  )
}
