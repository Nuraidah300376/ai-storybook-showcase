import { motion } from 'motion/react'
import { PROMPT_TERSEDIA } from '../../data/masterPrompt'
import { LALUAN } from '../../hooks/useHash'
import { JUMLAH_MS, SEGMEN, type JenisSegmen } from '../../lib/garisMasa'
import { IkonMain, IkonSalin, IkonTelefon } from '../Ikon'
import { KepalaSeksyen } from '../KepalaSeksyen'
import { TetapanQR } from './TetapanQR'

const LABEL_SEGMEN: Record<JenisSegmen, string> = {
  hook: 'Hook: SATU PROMPT, SEBUAH BUKU CERITA!',
  kulit: 'Kulit hadapan buku',
  halaman: 'Animasi selak halaman 2–12',
  struktur: 'Struktur master prompt',
  aliran: 'RANCANG → LULUS → JANA SATU HALAMAN',
  qr: 'Kod QR dan arahan mendapatkan prompt',
}

const saat = (ms: number) => Math.round(ms / 1000)

export function SeksyenTikTok({ onBuka }: { onBuka: () => void }) {
  return (
    <section id="tiktok" aria-labelledby="tajuk-tiktok" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <KepalaSeksyen
        id="tajuk-tiktok"
        label="Fasa 3 · TikTok Cinematic Showcase"
        tajuk={
          <>
            Persembahan sinematik <span className="teks-emas">9:16</span>, {saat(JUMLAH_MS)} saat
          </>
        }
        huraian="Kawasan asas 1080×1920 dengan selak halaman 3D, kamera perlahan dan teks besar dalam zon selamat TikTok."
      />

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="kaca flex flex-col rounded-3xl p-6 sm:p-7"
        >
          <p className="text-sm font-semibold text-white">Susunan {saat(JUMLAH_MS)} saat</p>
          <ol className="mt-4 space-y-2">
            {SEGMEN.map((s) => (
              <li key={s.jenis} className="flex items-baseline gap-3 text-sm">
                <span className="w-16 shrink-0 font-semibold text-emas-300 tabular-nums">
                  {saat(s.mulaMs)}–{saat(s.tamatMs)} s
                </span>
                <span className="text-slate-300">{LABEL_SEGMEN[s.jenis]}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onBuka} className="butang-zamrud">
              <IkonTelefon /> Buka Showcase 9:16
            </button>
            <a href={LALUAN.masterPrompt} className="butang-hantu">
              <IkonSalin /> Halaman Master Prompt Penuh
            </a>
          </div>
          {!PROMPT_TERSEDIA && (
            <p className="mt-3 text-xs text-emas-300">Master prompt asal belum dimasukkan (kandungan/master-prompt.txt).</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          <TetapanQR />
        </motion.div>
      </div>

      <div className="kaca mx-auto mt-6 max-w-5xl rounded-2xl p-5 text-sm text-slate-300">
        <p className="font-semibold text-emas-300">Cara merakam untuk TikTok</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-400">
          <li>Terbitkan halaman master prompt dan tetapkan URL awamnya supaya kod QR sebenar dijana.</li>
          <li>Buka Showcase 9:16, tekan Skrin Penuh, kemudian Sembunyikan Kawalan.</li>
          <li>Mulakan perakam skrin peranti, ketik skrin, tekan Mula, dan sembunyikan kawalan semula.</li>
          <li>Potong bahagian awal dan akhir rakaman supaya tepat 60 saat.</li>
        </ol>
        <p className="mt-3 inline-flex items-start gap-2 text-xs text-slate-500">
          <IkonMain className="mt-0.5 shrink-0" />
          Aplikasi ini tidak mengeksport MP4 atau sebarang fail video. Gunakan perakam skrin sedia ada pada telefon atau komputer.
        </p>
      </div>
    </section>
  )
}
