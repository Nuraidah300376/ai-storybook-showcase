import { useEffect, useState } from 'react'
import { BUKU } from '../data/buku'
import { LOKASI_FAIL_PROMPT, MASTER_PROMPT, PROMPT_TERSEDIA, TAJUK_PROMPT } from '../data/masterPrompt'
import { useSalin } from '../hooks/useSalin'
import { statistikPrompt } from '../lib/prompt'
import { IkonAmaran, IkonBuku, IkonMuatTurun, IkonSalin, IkonTanda } from './Ikon'

const SAIZ_TEKS = [15, 17, 19, 22] as const
const KUNCI_SAIZ = 'ai-storybook:saiz-teks-prompt'
const STAT = statistikPrompt(MASTER_PROMPT)

function bacaSaiz(): number {
  try {
    const n = Number(localStorage.getItem(KUNCI_SAIZ))
    return SAIZ_TEKS.includes(n as (typeof SAIZ_TEKS)[number]) ? n : 17
  } catch {
    return 17
  }
}

function muatTurun() {
  const blob = new Blob([MASTER_PROMPT + '\n'], { type: 'text/plain;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'master-prompt-amanah-kecil-hati-besar.txt'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

/**
 * Halaman MASTER PROMPT PENUH untuk penonton yang mengimbas kod QR.
 * Teks boleh dipilih, disalin dan dibaca dengan selesa pada telefon.
 */
export function HalamanMasterPrompt({ pautanUtama }: { pautanUtama: string }) {
  const { status, salin } = useSalin()
  const [saiz, setSaiz] = useState(bacaSaiz)

  useEffect(() => {
    document.title = `Master Prompt Penuh — ${BUKU.tajuk}`
  }, [])

  const ubahSaiz = (arah: 1 | -1) => {
    const i = SAIZ_TEKS.indexOf(saiz as (typeof SAIZ_TEKS)[number])
    const baharu = SAIZ_TEKS[Math.min(SAIZ_TEKS.length - 1, Math.max(0, i + arah))]
    setSaiz(baharu)
    try {
      localStorage.setItem(KUNCI_SAIZ, String(baharu))
    } catch {
      // Storan disekat: saiz tidak diingati.
    }
  }

  const labelSalin = status === 'berjaya' ? 'Disalin!' : status === 'gagal' ? 'Gagal — pilih teks secara manual' : 'Salin Prompt'

  return (
    <div className="min-h-[100svh] bg-navy-950 text-slate-100">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(33,58,122,0.55),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(31,163,122,0.12),transparent_50%)]" />

      <header className="relative mx-auto max-w-3xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
        <a href={pautanUtama} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emas-200">
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-emas-300 to-emas-500 text-navy-950">
            <IkonBuku />
          </span>
          AI Storybook Showcase
        </a>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-emas-300 uppercase">{TAJUK_PROMPT.split(' — ')[0]}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight font-bold text-white sm:text-4xl">
          {TAJUK_PROMPT.split(' — ')[1] ?? TAJUK_PROMPT}
        </h1>
        <p className="mt-3 text-base text-slate-300">
          Digunakan untuk menghasilkan buku <span className="font-display text-white italic">{BUKU.tajuk}</span>
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Penulis &amp; Pembangun: <span className="font-semibold text-emas-200">{BUKU.pembangun}</span>
        </p>
        {PROMPT_TERSEDIA && (
          <p className="mt-4 text-xs text-slate-500">
            {STAT.perkataan.toLocaleString('ms-MY')} patah perkataan · {STAT.baris.toLocaleString('ms-MY')} baris · ±{STAT.minitBaca} minit membaca
          </p>
        )}
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-32 sm:px-6">
        {PROMPT_TERSEDIA ? (
          <>
            <ol className="mb-5 space-y-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-emas-200">1.</span> Tekan <b>Salin Prompt</b> (atau tekan lama pada teks untuk memilih).
              </li>
              <li>
                <span className="font-semibold text-emas-200">2.</span> Tampal ke dalam alat AI pilihan anda dan ikut langkah{' '}
                <b>RANCANG → LULUS → JANA SATU HALAMAN</b>.
              </li>
            </ol>
            <article
              aria-label="Teks master prompt penuh"
              className="overflow-hidden rounded-2xl border border-emas-400/30 bg-navy-900/90 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <pre
                className="p-4 font-sans leading-relaxed break-words whitespace-pre-wrap text-slate-100 select-text sm:p-6"
                style={{ fontSize: saiz, userSelect: 'text', WebkitUserSelect: 'text' }}
              >
                {MASTER_PROMPT}
              </pre>
            </article>
          </>
        ) : (
          <div role="status" className="rounded-2xl border-2 border-dashed border-emas-400/50 bg-navy-900/80 p-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-emas-400/15 text-2xl text-emas-300">
              <IkonAmaran />
            </span>
            <p className="mt-4 text-lg font-bold tracking-wide text-emas-200">MASTER PROMPT BELUM DIMASUKKAN</p>
            <p className="mt-2 text-sm text-slate-300">Halaman ini akan memaparkan master prompt penuh sebaik sahaja pemilik memasukkannya.</p>
            <p className="mt-4 text-xs text-slate-500">
              Untuk pemilik: tampal master prompt asal di antara penanda dalam fail <code className="text-slate-300">{LOKASI_FAIL_PROMPT}</code>,
              kemudian bina dan terbitkan semula.
            </p>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {BUKU.pembangun} · {BUKU.tajuk}
        </footer>
      </main>

      {PROMPT_TERSEDIA && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-navy-950/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <button
              type="button"
              onClick={() => salin(MASTER_PROMPT)}
              className={`${status === 'berjaya' ? 'butang-zamrud' : 'butang-emas'} min-h-12 flex-1 text-base`}
            >
              {status === 'berjaya' ? <IkonTanda /> : <IkonSalin />} {labelSalin}
            </button>
            <button type="button" onClick={muatTurun} className="butang-hantu min-h-12 px-3" aria-label="Muat turun fail .txt" title="Muat turun .txt">
              <IkonMuatTurun />
            </button>
            <div role="group" aria-label="Saiz teks" className="flex">
              <button type="button" onClick={() => ubahSaiz(-1)} disabled={saiz === SAIZ_TEKS[0]} className="butang-hantu min-h-12 rounded-r-none px-3" aria-label="Kecilkan teks">
                A−
              </button>
              <button
                type="button"
                onClick={() => ubahSaiz(1)}
                disabled={saiz === SAIZ_TEKS[SAIZ_TEKS.length - 1]}
                className="butang-hantu min-h-12 rounded-l-none border-l-0 px-3"
                aria-label="Besarkan teks"
              >
                A+
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {status === 'berjaya' ? 'Prompt telah disalin ke papan keratan.' : status === 'gagal' ? 'Prompt gagal disalin.' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
