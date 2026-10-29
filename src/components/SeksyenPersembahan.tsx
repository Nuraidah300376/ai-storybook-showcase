import { motion } from 'motion/react'
import { SLAID, TEMPOH_MS } from '../data/slaid'
import { JUMLAH_MS } from '../data/tiktok'
import { IkonMain, IkonMonitor, IkonQr, IkonTelefon } from './Ikon'
import { KepalaSeksyen } from './KepalaSeksyen'
import type { Orientasi } from './Pentas'

const jumlahSaat = Math.round(
  (TEMPOH_MS.pembukaan + TEMPOH_MS.penutup + TEMPOH_MS.halaman * (SLAID.length - 2)) / 1000,
)

export function SeksyenPersembahan({ onBuka, onTikTok60 }: { onBuka: (o: Orientasi) => void; onTikTok60: () => void }) {
  const kad = [
    {
      o: 'menegak' as const,
      ikon: <IkonTelefon />,
      tajuk: 'Menegak 9:16',
      huraian: 'Sesuai untuk rakaman skrin TikTok, Reels dan Shorts.',
      bentuk: 'aspect-[9/16] w-16',
      butang: 'butang-zamrud',
    },
    {
      o: 'landskap' as const,
      ikon: <IkonMonitor />,
      tajuk: 'Landskap 16:9',
      huraian: 'Sesuai untuk tayangan di kelas, projektor atau YouTube.',
      bentuk: 'aspect-[16/9] w-28',
      butang: 'butang-emas',
    },
  ]

  return (
    <section id="persembahan" aria-labelledby="tajuk-persembahan" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <KepalaSeksyen
        id="tajuk-persembahan"
        label="Mod Persembahan Automatik"
        tajuk={
          <>
            Tayang secara <span className="teks-emas">automatik</span>
          </>
        }
        huraian={`Pembukaan, 12 halaman dan penutup bertukar sendiri (kira-kira ${jumlahSaat} saat). Kawal dengan butang Mula, Jeda dan Ulang.`}
      />

      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {kad.map((k, i) => (
          <motion.div
            key={k.o}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            className="kaca flex flex-col items-center rounded-3xl p-8 text-center"
          >
            <div className="grid h-32 place-items-center">
              <div className={`${k.bentuk} rounded-lg border-2 border-emas-400/60 bg-gradient-to-br from-navy-700 to-navy-900`} />
            </div>
            <h3 className="mt-4 inline-flex items-center gap-2 text-xl font-semibold text-white">
              {k.ikon} {k.tajuk}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{k.huraian}</p>
            <button type="button" className={`${k.butang} mt-6`} onClick={() => onBuka(k.o)}>
              <IkonMain /> Buka Persembahan
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.24, duration: 0.7 }}
        className="relative mx-auto mt-5 max-w-4xl overflow-hidden rounded-3xl border border-emas-400/40 bg-gradient-to-br from-navy-800 via-navy-900 to-zamrud-700/40 p-6 sm:p-8"
      >
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="grid aspect-[9/16] w-20 shrink-0 place-items-center rounded-xl border-2 border-emas-400/70 bg-navy-950 text-emas-300">
            <IkonQr width="2em" height="2em" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="label-seksyen">Fasa 3 · Baharu</p>
            <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">TikTok {Math.round(JUMLAH_MS / 1000)} saat: Kongsi Master Prompt</h3>
            <p className="mt-2 text-sm text-slate-400">
              Hook, kulit hadapan, 12 halaman diselak 3D, kelebihan master prompt, proses RANCANG → LULUS → JANA SATU HALAMAN dan
              kod QR ke prompt percuma. Format 9:16 (asas 1080×1920) dengan kapsyen dalam kawasan selamat.
            </p>
          </div>
          <button type="button" className="butang-emas shrink-0" onClick={onTikTok60}>
            <IkonMain /> Buka TikTok 60s
          </button>
        </div>
      </motion.div>

      <div className="kaca mx-auto mt-6 max-w-4xl rounded-2xl p-5 text-sm text-slate-300">
        <p className="font-semibold text-emas-300">Petua rakaman TikTok</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-400">
          <li>Buka mod Menegak 9:16 (atau TikTok 60 saat) dan tekan butang skrin penuh.</li>
          <li>Tekan butang mata (atau kekunci H) untuk menyembunyikan kawalan.</li>
          <li>Mulakan perakam skrin peranti anda, kemudian ketik skrin dan tekan Mula atau Ulang.</li>
          <li>Dalam TikTok 60 saat, butang <strong>Rakam Bersih</strong> menyembunyikan kawalan dan bermula dari 0:00 selepas 2 saat.</li>
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          Aplikasi ini tidak mengeksport video. Gunakan fungsi rakaman skrin sedia ada pada telefon atau komputer.
        </p>
      </div>
    </section>
  )
}
