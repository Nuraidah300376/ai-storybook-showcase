import { useEffect, useState } from 'react'
import { maklumatStoran, mintaStoranKekal, type MaklumatStoran, type ModStoran } from '../../lib/storImej'
import { formatSaiz } from '../../lib/susunFail'
import { IkonPangkalan } from '../Ikon'

interface Props {
  mod: ModStoran
  bilangan: number
}

/** Penerangan jujur tentang di mana imej disimpan dan batasannya. */
export function StatusStoran({ mod, bilangan }: Props) {
  const [maklumat, setMaklumat] = useState<MaklumatStoran | null>(null)
  const [permintaan, setPermintaan] = useState<'lulus' | 'tolak' | null>(null)

  useEffect(() => {
    let batal = false
    void maklumatStoran().then((m) => !batal && setMaklumat(m))
    return () => {
      batal = true
    }
  }, [bilangan, permintaan])

  const minta = async () => setPermintaan((await mintaStoranKekal()) ? 'lulus' : 'tolak')

  return (
    <div className="kaca rounded-3xl p-5 text-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-zamrud-500/15 text-lg text-zamrud-300">
          <IkonPangkalan />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">Di mana imej yang dimuat naik disimpan?</p>
          <p className="text-slate-400">
            {mod === 'memuat' && 'Menyemak storan pelayar…'}
            {mod === 'pelayar' && (
              <>
                <span className="font-semibold text-emas-300">Storan pelayar ini (IndexedDB)</span> — kekal selepas muat
                semula atau pelayar ditutup, pada peranti dan pelayar ini sahaja.
              </>
            )}
            {mod === 'sesi' && (
              <>
                <span className="font-semibold text-rose-300">Sesi ini sahaja</span> — storan pelayar tidak tersedia. Imej
                akan hilang apabila tab ditutup atau dimuat semula. Eksport pakej sebelum keluar.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-emas-400/25 bg-emas-400/5 p-4 text-slate-300">
        <p>
          Imej <strong className="text-white">tidak</strong> dihantar ke mana-mana pelayan dan{' '}
          <strong className="text-white">tidak</strong> disimpan ke GitHub secara automatik. Penonton lain yang membuka
          pautan aplikasi ini tidak akan melihat imej yang anda muat naik.
        </p>
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer font-semibold text-zamrud-300 marker:text-emas-300">Batasan storan pelayar</summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-400">
          <li>Hanya pada pelayar dan peranti ini. Imej tidak muncul pada telefon, komputer atau pelayar lain.</li>
          <li>
            Setiap alamat mempunyai storan sendiri: <code className="text-emas-200">localhost</code>, laman terbitan (contohnya
            GitHub Pages) dan fail pratonton tempatan tidak berkongsi imej.
          </li>
          <li>Imej hilang jika data laman atau sejarah pelayar dipadam.</li>
          <li>Tetingkap inkognito atau peribadi memadam semua imej apabila ditutup.</li>
          <li>
            Pelayar boleh membuang storan apabila ruang cakera rendah. Safari boleh memadam data laman yang tidak dibuka
            selama 7 hari.
          </li>
          <li>Kuota storan berbeza mengikut pelayar dan ruang kosong peranti.</li>
        </ul>
        <p className="mt-3 text-slate-400">
          Untuk simpanan <strong className="text-white">kekal dan boleh dikongsi</strong>, tekan{' '}
          <strong className="text-zamrud-300">Eksport Pakej</strong>, nyahzip, kemudian salin folder{' '}
          <code className="text-emas-200">halaman/</code> ke <code className="text-emas-200">public/halaman/</code> dalam
          repositori dan commit ke GitHub. Lihat bahagian Panduan di bawah.
        </p>
      </details>

      {mod === 'pelayar' && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
          {maklumat?.digunakan != null && maklumat.kuota != null && (
            <span>
              Digunakan: {formatSaiz(maklumat.digunakan)} daripada anggaran {formatSaiz(maklumat.kuota)}
            </span>
          )}
          {maklumat?.kekal === true ? (
            <span className="text-zamrud-300">Pelayar menandakan storan ini sebagai kekal (tidak dibuang secara automatik).</span>
          ) : maklumat?.kekal === false ? (
            <>
              <button type="button" className="butang-hantu min-h-9 px-3 text-xs" onClick={minta}>
                Minta storan kekal
              </button>
              {permintaan === 'tolak' && <span>Pelayar tidak meluluskan permintaan ini. Imej masih disimpan seperti biasa.</span>}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
