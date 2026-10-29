import { useCallback, useEffect, useState } from 'react'
import { JUMLAH_BINGKAI, SPESIFIKASI_VIDEO } from '../../data/tiktok'
import {
  URL_ALIRAN_KERJA,
  batalTugas,
  binaMuatan,
  mulaEksport,
  semakPelayan,
  statusTugas,
  urlFail,
  type StatusPelayan,
  type TugasEksport,
} from '../../lib/eksportVideo'
import { useKodQrTersuai } from '../../lib/kodQrTersuai'
import { useStorImej } from '../../lib/storImej'
import { IkonAmaran, IkonMuatTurun, IkonTanda, IkonTutup } from '../Ikon'

const minit = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000))
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`
}

const SPEK = `MP4 · H.264 · ${SPESIFIKASI_VIDEO.lebar}×${SPESIFIKASI_VIDEO.tinggi} (9:16) · ${SPESIFIKASI_VIDEO.fps} fps · ${
  SPESIFIKASI_VIDEO.tempohMs / 1000
} s · tanpa audio`

/**
 * Panel EKSPORT VIDEO MP4. Pemaparan berlaku dalam Chromium tanpa kepala yang
 * berasingan (pelayan tempatan), jadi persembahan di skrin ini tidak terjejas.
 */
export function PanelEksport({ onTutup }: { onTutup: () => void }) {
  const [pelayan, setPelayan] = useState<StatusPelayan | null | 'menyemak'>('menyemak')
  const [tugas, setTugas] = useState<TugasEksport | null>(null)
  const [ralat, setRalat] = useState<string | null>(null)
  const [menghantar, setMenghantar] = useState(false)
  const [kini, setKini] = useState(() => Date.now())
  const imejDimuatNaik = Object.keys(useStorImej().imej).length
  const kodQr = useKodQrTersuai()

  useEffect(() => {
    let batal = false
    void semakPelayan().then((s) => {
      if (batal) return
      setPelayan(s)
      if (s?.tugas) setTugas(s.tugas)
    })
    return () => {
      batal = true
    }
  }, [])

  // Tinjau status setiap saat selagi tugas berjalan.
  const idBerjalan = tugas?.keadaan === 'berjalan' ? tugas.id : null
  useEffect(() => {
    if (!idBerjalan) return
    const t = window.setInterval(() => {
      setKini(Date.now())
      statusTugas(idBerjalan).then(setTugas, (e: unknown) => setRalat(e instanceof Error ? e.message : String(e)))
    }, 1000)
    return () => window.clearInterval(t)
  }, [idBerjalan])

  const mula = useCallback(async () => {
    setRalat(null)
    setMenghantar(true)
    try {
      setTugas(await mulaEksport(await binaMuatan()))
      setKini(Date.now())
    } catch (e) {
      setRalat(e instanceof Error ? e.message : String(e))
    } finally {
      setMenghantar(false)
    }
  }, [])

  return (
    <div className="absolute inset-x-3 bottom-full mb-2 sm:left-auto sm:right-5 sm:w-[30rem]" onClick={(e) => e.stopPropagation()}>
      <div className="kaca max-h-[70dvh] overflow-y-auto rounded-2xl bg-navy-900/95 p-4 text-sm shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold tracking-wide text-white">EKSPORT VIDEO MP4</p>
            <p className="mt-0.5 text-[0.75rem] text-slate-400">{SPEK}</p>
          </div>
          <button type="button" onClick={onTutup} className="text-slate-400 hover:text-white" aria-label="Tutup panel eksport video">
            <IkonTutup />
          </button>
        </div>

        {pelayan === 'menyemak' && <p className="mt-3 text-slate-300">Menyemak enjin eksport…</p>}

        {pelayan === null && <TiadaEnjin />}

        {pelayan && pelayan !== 'menyemak' && !pelayan.ffmpeg && (
          <p className="mt-3 flex items-start gap-1.5 text-rose-300">
            <IkonAmaran className="mt-0.5 shrink-0" /> FFmpeg tidak ditemui pada komputer ini. Pasang FFmpeg (lihat panduan
            docs/PANDUAN-EKSPORT-VIDEO.md), kemudian mulakan semula pelayan.
          </p>
        )}

        {pelayan && pelayan !== 'menyemak' && pelayan.ffmpeg && (
          <div className="mt-3 space-y-3" aria-live="polite">
            {(!tugas || tugas.keadaan !== 'berjalan') && tugas?.keadaan !== 'berjaya' && (
              <>
                <ul className="space-y-1 text-[0.8rem] text-slate-300">
                  <li>
                    • Imej halaman: {imejDimuatNaik > 0 ? `${imejDimuatNaik} dimuat naik + ` : ''}fail dalam public/halaman/
                  </li>
                  <li>• Kod QR: {kodQr ? `imej ${kodQr.nama}` : 'dijana daripada pautan master prompt'}</li>
                  <li>• Animasi sebenar dilukis bingkai demi bingkai ({JUMLAH_BINGKAI} bingkai), kemudian disemak automatik.</li>
                  <li>• Anggaran masa: kira-kira 8–15 minit. Persembahan di skrin ini tidak terjejas.</li>
                </ul>
                <button type="button" className="butang-emas w-full" disabled={menghantar} onClick={() => void mula()}>
                  {menghantar ? 'Menghantar…' : tugas ? 'Cuba Lagi' : 'Mula Eksport MP4'}
                </button>
              </>
            )}

            {tugas && <StatusTugas tugas={tugas} kini={kini} />}

            {tugas?.keadaan === 'berjalan' && (
              <button type="button" className="butang-hantu min-h-9 w-full" onClick={() => void batalTugas(tugas.id).then(setTugas)}>
                Batal eksport
              </button>
            )}

            {tugas?.keadaan === 'berjaya' && (
              <div className="flex flex-wrap gap-2">
                <a className="butang-emas flex-1" href={urlFail(tugas.id)} download={tugas.namaFail}>
                  <IkonMuatTurun /> Muat Turun MP4
                </a>
                <button type="button" className="butang-hantu" disabled={menghantar} onClick={() => void mula()}>
                  Eksport semula
                </button>
              </div>
            )}
          </div>
        )}

        {ralat && (
          <p role="alert" className="mt-3 flex items-start gap-1.5 text-[0.8rem] text-rose-300">
            <IkonAmaran className="mt-0.5 shrink-0" /> {ralat}
          </p>
        )}
      </div>
    </div>
  )
}

function StatusTugas({ tugas, kini }: { tugas: TugasEksport; kini: number }) {
  const peratus = tugas.jumlah ? Math.min(100, (tugas.bingkai / tugas.jumlah) * 100) : 0
  const berlalu = (tugas.tamat ?? kini) - tugas.dimulakan
  const baki = tugas.bingkai > 30 ? (berlalu / tugas.bingkai) * (tugas.jumlah - tugas.bingkai) : null
  return (
    <div>
      {tugas.keadaan === 'berjalan' && (
        <>
          <div className="flex justify-between text-[0.8rem] text-slate-300">
            <span>{tugas.fasa}</span>
            <span className="tabular-nums">{peratus.toFixed(0)}%</span>
          </div>
          <div
            className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(peratus)}
            aria-label="Kemajuan eksport video"
          >
            <div className="h-full bg-gradient-to-r from-emas-300 to-zamrud-400 transition-[width] duration-700" style={{ width: `${peratus}%` }} />
          </div>
          <p className="mt-1.5 text-[0.75rem] text-slate-400 tabular-nums">
            Bingkai {tugas.bingkai}/{tugas.jumlah} · {minit(berlalu)} berlalu
            {baki !== null && ` · baki ≈ ${minit(baki)}`}
          </p>
        </>
      )}

      {tugas.keadaan === 'berjaya' && (
        <p className="flex items-start gap-1.5 font-semibold text-zamrud-300">
          <IkonTanda className="mt-0.5 shrink-0" /> Berjaya: {tugas.namaFail}
          {tugas.saizBait ? ` (${(tugas.saizBait / 1024 / 1024).toFixed(1)} MB)` : ''} · {minit(berlalu)}
        </p>
      )}

      {(tugas.keadaan === 'gagal' || tugas.keadaan === 'dibatalkan') && (
        <p className="flex items-start gap-1.5 text-rose-300">
          <IkonAmaran className="mt-0.5 shrink-0" /> {tugas.keadaan === 'gagal' ? 'Gagal' : 'Dibatalkan'}: {tugas.mesej ?? 'tiada butiran'}
        </p>
      )}

      {tugas.semakan && tugas.keadaan !== 'berjalan' && (
        <ul className="mt-2 space-y-0.5 rounded-lg bg-black/25 p-2.5 text-[0.72rem]">
          {tugas.semakan.map((s) => (
            <li key={s.nama} className={s.lulus ? 'text-slate-300' : 'text-rose-300'}>
              {s.lulus ? '✔' : '✘'} {s.nama} <span className="text-slate-500">— {s.butiran}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Tiada pelayan tempatan: terangkan sekatan dengan jujur dan beri kaedah sebenar. */
function TiadaEnjin() {
  return (
    <div className="mt-3 space-y-3 text-[0.8rem] leading-relaxed text-slate-300">
      <p>
        Eksport MP4 tidak boleh dijalankan di sini. Pelayar biasa, fail pratonton dan Claude Artifact tidak dapat melukis animasi 3D
        bingkai demi bingkai dan mengekod H.264 dengan tepat. Video dihasilkan oleh <b>enjin pemaparan</b> (Chromium tanpa kepala +
        FFmpeg) melalui salah satu cara di bawah.
      </p>
      <div className="rounded-lg bg-black/25 p-3">
        <p className="font-semibold text-emas-200">Cara A — GitHub Actions (tanpa pemasangan)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>
            Buka{' '}
            <a className="text-zamrud-300 underline" href={URL_ALIRAN_KERJA} target="_blank" rel="noreferrer">
              Actions → Eksport Video TikTok
            </a>
            .
          </li>
          <li>Tekan <b>Run workflow</b> → <b>Run workflow</b>.</li>
          <li>Tunggu tanda ✔ hijau (±15 minit), buka larian itu.</li>
          <li>
            Di bahagian <b>Artifacts</b>, muat turun <b>video-tiktok-60s</b> (ZIP mengandungi MP4 dan laporan semakan).
          </li>
        </ol>
        <p className="mt-1 text-[0.72rem] text-slate-500">
          Menggunakan imej dalam public/halaman/ di GitHub dan kod QR master prompt.
        </p>
      </div>
      <div className="rounded-lg bg-black/25 p-3">
        <p className="font-semibold text-emas-200">Cara B — komputer sendiri (butang satu klik)</p>
        <p className="mt-1">
          Jalankan <code className="text-emas-200">npm run eksport:pelayan</code>, kemudian tekan butang ini sekali lagi. Imej yang anda
          muat naik dan kod QR tersuai turut dimasukkan.
        </p>
      </div>
      <p className="text-[0.72rem] text-slate-500">Panduan penuh: docs/PANDUAN-EKSPORT-VIDEO.md</p>
    </div>
  )
}
