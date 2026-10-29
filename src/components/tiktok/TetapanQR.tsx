import { useState, type FormEvent } from 'react'
import { useUrlPrompt } from '../../hooks/useUrlPrompt'
import { muatTurun } from '../../lib/muatTurun'
import { svgQR } from '../../lib/qr'
import { sahkanUrlAwam } from '../../lib/urlAwam'
import { IkonAmaran, IkonMuatTurun, IkonTanda } from '../Ikon'
import { KodQR } from './KodQR'

function muatTurunSVG(url: string) {
  void muatTurun(new Blob([svgQR(url)], { type: 'image/svg+xml' }), 'kod-qr-master-prompt.svg')
}

/** Panel menetapkan URL awam perkongsian prompt dan pratonton kod QR. */
export function TetapanQR() {
  const { url, ralat, sumber, disimpan, tetapkan } = useUrlPrompt()
  const [input, setInput] = useState(disimpan)
  const [mesej, setMesej] = useState<string | null>(null)

  const simpan = (e: FormEvent) => {
    e.preventDefault()
    const k = sahkanUrlAwam(input)
    if (!k.sah) {
      setMesej(k.sebab)
      return
    }
    tetapkan(k.url)
    setInput(k.url)
    setMesej(null)
  }

  return (
    <div className="kaca grid gap-6 rounded-3xl p-5 sm:grid-cols-[auto_1fr] sm:p-7">
      <div className="mx-auto">
        <div className={`rounded-2xl p-3 ${url ? 'bg-white' : 'bg-navy-950'}`}>
          <KodQR url={url} saiz={176} />
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">Kod QR perkongsian master prompt</p>
        {url ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zamrud-300">
            <IkonTanda /> Dikonfigurasi {sumber === 'pelayar' ? '(disimpan dalam pelayar ini)' : '(src/data/tiktok.ts)'}
          </p>
        ) : (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emas-300">
            <IkonAmaran /> BELUM DIKONFIGURASI
          </p>
        )}
        {url && <p className="mt-1 text-xs break-all text-slate-400">{url}</p>}
        {ralat && <p className="mt-1 text-xs text-red-300">URL sedia ada ditolak: {ralat}</p>}

        <form onSubmit={simpan} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="url-prompt">
            URL awam halaman master prompt
          </label>
          <input
            id="url-prompt"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://nama-anda.github.io/ai-storybook-showcase/prompt/"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setMesej(null)
            }}
            className="min-h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-navy-950/70 px-4 text-sm text-white placeholder:text-slate-600 focus:border-emas-400/70 focus:outline-none"
          />
          <button type="submit" className="butang-emas">
            Jana Kod QR
          </button>
        </form>
        {mesej && (
          <p role="alert" className="mt-2 text-xs text-red-300">
            {mesej}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {url && (
            <>
              <a href={url} target="_blank" rel="noopener noreferrer" className="butang-hantu min-h-9 px-4 text-xs">
                Buka pautan untuk diuji
              </a>
              <button type="button" onClick={() => muatTurunSVG(url)} className="butang-hantu min-h-9 px-4 text-xs">
                <IkonMuatTurun /> Muat turun QR (SVG)
              </button>
            </>
          )}
          {disimpan && (
            <button
              type="button"
              onClick={() => {
                tetapkan('')
                setInput('')
              }}
              className="butang-hantu min-h-9 px-4 text-xs"
            >
              Kosongkan
            </button>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Masukkan hanya URL yang sudah diterbitkan dan boleh dibuka di telefon lain (contohnya halaman <code>prompt/</code> di
          GitHub Pages). Aplikasi hanya menyemak bentuk URL — ia tidak dapat mengesahkan bahawa halaman itu wujud. URL di sini
          disimpan dalam pelayar ini sahaja; untuk tetapan kekal, isi <code>URL_PERKONGSIAN_PROMPT</code> dalam{' '}
          <code>src/data/tiktok.ts</code>.
        </p>
      </div>
    </div>
  )
}
