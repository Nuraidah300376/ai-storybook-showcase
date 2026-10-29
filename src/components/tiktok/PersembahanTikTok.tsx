import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { JUMLAH_HALAMAN } from '../../data/buku'
import { URL_PROMPT } from '../../data/masterPrompt'
import { ADEGAN, BAHAGIAN, JUMLAH_MS, MULA_MS, NAMA_BAHAGIAN, indeksBahagian, tempohAdegan } from '../../data/tiktok'
import { useAutoplay } from '../../hooks/useAutoplay'
import { useSaizPentas } from '../../hooks/useSaizPentas'
import { buangKodQrTersuai, muatNaikKodQr, useKodQrTersuai } from '../../lib/kodQrTersuai'
import {
  IkonAmaran,
  IkonGrid,
  IkonJeda,
  IkonKanan,
  IkonKiri,
  IkonMain,
  IkonMataTutup,
  IkonQr,
  IkonSkrinPenuh,
  IkonTanda,
  IkonTutup,
  IkonUlang,
  IkonVideo,
} from '../Ikon'
import { useBilanganImejSedia } from '../ImejHalaman'
import { PanelEksport } from './PanelEksport'
import { LEBAR_PENTAS, PentasTikTok, TINGGI_PENTAS } from './PentasTikTok'

/** Kelewatan sebelum "Rakam Bersih" bermula: masa untuk memulakan perakam skrin tanpa kawalan kelihatan. */
const TUNDA_RAKAM_MS = 2_000

const mmss = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Mod persembahan TikTok 60 saat (Fasa 3): berkongsi master prompt buku cerita.
 * Pentas 1080×1920 diskala supaya muat pada skrin. Fasa 4: butang Eksport MP4
 * menghasilkan video siap (lihat PanelEksport).
 */
export function PersembahanTikTok({ onTutup }: { onTutup: () => void }) {
  const ap = useAutoplay({ jumlah: ADEGAN.length, tempoh: tempohAdegan })
  const [dimulakan, setDimulakan] = useState(false)
  const [kawalanTersembunyi, setKawalanTersembunyi] = useState(false)
  const [petunjuk, setPetunjuk] = useState(false)
  const [panduan, setPanduan] = useState(false)
  const [panelQr, setPanelQr] = useState(false)
  const [panelEksport, setPanelEksport] = useState(false)
  const [menunggu, setMenunggu] = useState(false)
  const akarRef = useRef<HTMLDivElement>(null)
  const tundaRef = useRef<number | undefined>(undefined)
  const { ref: bekasRef, saiz } = useSaizPentas(LEBAR_PENTAS / TINGGI_PENTAS)
  const kodQr = useKodQrTersuai()
  const imejSedia = useBilanganImejSedia()

  const masa = Math.min(JUMLAH_MS, MULA_MS[ap.indeks] + ap.berlalu)
  const bahagian = ADEGAN[ap.indeks].jenis

  useEffect(() => {
    const asal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    akarRef.current?.focus()
    return () => {
      document.body.style.overflow = asal
      window.clearTimeout(tundaRef.current)
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!petunjuk) return
    const t = window.setTimeout(() => setPetunjuk(false), 2600)
    return () => window.clearTimeout(t)
  }, [petunjuk])

  const batalTunda = useCallback(() => {
    window.clearTimeout(tundaRef.current)
    setMenunggu(false)
  }, [])

  const { mula, jeda, ulang: ulangAp, pergi } = ap
  const togol = useCallback(() => {
    batalTunda()
    if (ap.bermain) jeda()
    else {
      setDimulakan(true)
      mula()
    }
  }, [ap.bermain, jeda, mula, batalTunda])

  const ulang = useCallback(() => {
    batalTunda()
    setDimulakan(true)
    ulangAp()
  }, [ulangAp, batalTunda])

  /** Lompat ke bahagian lain (kulit, halaman, …) tanpa mengubah keadaan main/jeda. */
  const lompat = useCallback(
    (arah: 1 | -1) => {
      batalTunda()
      setDimulakan(true)
      const semasa = BAHAGIAN.indexOf(bahagian)
      const mulaSemasa = MULA_MS[indeksBahagian(bahagian)]
      // Ke belakang: kembali ke awal bahagian ini dahulu jika sudah lebih sesaat di dalamnya.
      const sasaran = arah === -1 && masa - mulaSemasa > 1_000 ? semasa : semasa + arah
      const j = BAHAGIAN[Math.min(BAHAGIAN.length - 1, Math.max(0, sasaran))]
      pergi(indeksBahagian(j))
    },
    [bahagian, masa, pergi, batalTunda],
  )

  const togolSkrinPenuh = useCallback(() => {
    const el = akarRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    else void el.requestFullscreen?.().catch(() => {})
  }, [])

  const sembunyi = useCallback(() => {
    setKawalanTersembunyi(true)
    setPanelQr(false)
    setPanelEksport(false)
    setPetunjuk(true)
  }, [])

  /** Sembunyikan kawalan, tunjuk pentas kosong, kemudian main dari 0:00 — rakaman bersih tanpa kawalan. */
  const rakamBersih = useCallback(() => {
    batalTunda()
    jeda()
    setDimulakan(false)
    setPanelQr(false)
    setPanelEksport(false)
    setKawalanTersembunyi(true)
    setPetunjuk(false)
    setMenunggu(true)
    tundaRef.current = window.setTimeout(() => {
      setMenunggu(false)
      setDimulakan(true)
      ulangAp()
    }, TUNDA_RAKAM_MS)
  }, [jeda, ulangAp, batalTunda])

  useEffect(() => {
    const onKekunci = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button, input')) return
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault()
          togol()
          break
        case 'ArrowRight':
          lompat(1)
          break
        case 'ArrowLeft':
          lompat(-1)
          break
        case 'r':
        case 'R':
          ulang()
          break
        case 'h':
        case 'H':
          setKawalanTersembunyi((s) => !s)
          break
        case 'f':
        case 'F':
          togolSkrinPenuh()
          break
        case 'g':
        case 'G':
          setPanduan((s) => !s)
          break
        case 'Escape':
          if (panelQr) setPanelQr(false)
          else if (panelEksport) setPanelEksport(false)
          else if (!document.fullscreenElement) onTutup()
          break
      }
    }
    window.addEventListener('keydown', onKekunci)
    return () => window.removeEventListener('keydown', onKekunci)
  }, [togol, ulang, lompat, togolSkrinPenuh, onTutup, panelQr, panelEksport])

  const skala = saiz.w / LEBAR_PENTAS

  return (
    <motion.div
      ref={akarRef}
      role="dialog"
      aria-modal="true"
      aria-label="Persembahan TikTok 60 saat: Master Prompt Buku Cerita"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex flex-col bg-black outline-none"
      onClick={
        kawalanTersembunyi
          ? () => {
              batalTunda()
              setKawalanTersembunyi(false)
            }
          : undefined
      }
    >
      <div
        ref={bekasRef}
        className={`relative flex min-h-0 flex-1 items-center justify-center ${kawalanTersembunyi ? '' : 'p-3 sm:p-5'}`}
      >
        <div
          data-pentas-tiktok
          data-masa={Math.round(masa)}
          style={{ width: saiz.w, height: saiz.h }}
          className={`relative overflow-hidden ${kawalanTersembunyi ? '' : 'rounded-2xl ring-1 ring-white/10'}`}
        >
          {saiz.w > 0 && (
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${skala})` }}>
              <PentasTikTok
                indeks={ap.indeks}
                masa={masa}
                sesi={ap.sesi}
                dimulakan={dimulakan}
                petunjukMula={!menunggu && !kawalanTersembunyi}
                panduanSelamat={panduan && !kawalanTersembunyi}
                kodQr={kodQr}
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {petunjuk && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-center text-xs text-slate-200"
            >
              Tekan H atau ketik skrin untuk memaparkan kawalan
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!kawalanTersembunyi && (
        <div className="relative border-t border-white/10 bg-navy-950/95 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          {panelQr && <PanelKodQr onTutup={() => setPanelQr(false)} />}
          {panelEksport && <PanelEksport onTutup={() => setPanelEksport(false)} />}

          {/* Garis masa: klik untuk lompat ke bahagian */}
          <div className="mx-auto mb-2.5 flex max-w-3xl gap-1" role="group" aria-label="Bahagian persembahan">
            {BAHAGIAN.map((j) => {
              const i = indeksBahagian(j)
              const mulaJ = MULA_MS[i]
              const akhirJ = BAHAGIAN.indexOf(j) < BAHAGIAN.length - 1 ? MULA_MS[indeksBahagian(BAHAGIAN[BAHAGIAN.indexOf(j) + 1])] : JUMLAH_MS
              const isi = Math.min(1, Math.max(0, (masa - mulaJ) / (akhirJ - mulaJ)))
              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => {
                    batalTunda()
                    setDimulakan(true)
                    pergi(i)
                  }}
                  className="group flex min-w-0 flex-col gap-1 text-left"
                  style={{ flex: akhirJ - mulaJ }}
                  title={`${NAMA_BAHAGIAN[j]} (${mmss(mulaJ)})`}
                  aria-current={bahagian === j}
                >
                  <span className="h-1.5 w-full overflow-hidden rounded-full bg-white/15 group-hover:bg-white/25">
                    <span className="block h-full bg-gradient-to-r from-emas-300 to-zamrud-400" style={{ width: `${isi * 100}%` }} />
                  </span>
                  <span className={`truncate text-[0.65rem] ${bahagian === j ? 'text-emas-200' : 'text-slate-500'}`}>
                    {NAMA_BAHAGIAN[j]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <button type="button" className="butang-hantu px-3" onClick={() => lompat(-1)} aria-label="Bahagian sebelumnya">
                <IkonKiri />
              </button>
              <button type="button" className="butang-emas min-w-28" onClick={togol} aria-pressed={ap.bermain}>
                {ap.bermain ? <IkonJeda /> : <IkonMain />} {ap.bermain ? 'Jeda' : 'Mula'}
              </button>
              <button type="button" className="butang-zamrud" onClick={ulang}>
                <IkonUlang /> Ulang
              </button>
              <button type="button" className="butang-hantu px-3" onClick={() => lompat(1)} aria-label="Bahagian seterusnya">
                <IkonKanan />
              </button>
            </div>

            <span className="px-1 text-xs text-slate-400 tabular-nums" aria-live="off">
              {mmss(masa)} / {mmss(JUMLAH_MS)}
              {ap.tamat && ' · Tamat'}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] ${
                imejSedia === JUMLAH_HALAMAN ? 'bg-zamrud-500/15 text-zamrud-300' : 'bg-emas-400/15 text-emas-200'
              }`}
              title="Imej halaman yang sudah dimuat"
            >
              {imejSedia === JUMLAH_HALAMAN ? <IkonTanda /> : <IkonAmaran />} {imejSedia}/{JUMLAH_HALAMAN} imej
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="butang-hantu px-3 sm:px-5"
                onClick={(e) => {
                  e.stopPropagation()
                  rakamBersih()
                }}
                aria-label="Rakam Bersih: sembunyikan kawalan dan mula dari 0:00 selepas 2 saat"
                title="Sembunyikan kawalan dan mula dari 0:00 selepas 2 saat"
              >
                <IkonMataTutup /> Rakam<span className="hidden sm:inline"> Bersih</span>
              </button>
              <button
                type="button"
                className={`butang-hantu px-3 sm:px-5 ${panelEksport ? 'border-emas-400/60 text-emas-200' : ''}`}
                onClick={() => {
                  setPanelQr(false)
                  setPanelEksport((s) => !s)
                }}
                aria-expanded={panelEksport}
                aria-label="Eksport Video MP4"
                title="Eksport video MP4 1080×1920, 30 fps, 60 saat"
              >
                <IkonVideo /> Eksport<span className="hidden sm:inline"> MP4</span>
              </button>
              <button
                type="button"
                className={`butang-hantu px-3 ${panelQr ? 'border-emas-400/60 text-emas-200' : ''}`}
                onClick={() => {
                  setPanelEksport(false)
                  setPanelQr((s) => !s)
                }}
                aria-expanded={panelQr}
                aria-label="Tetapan kod QR"
                title="Kod QR"
              >
                <IkonQr />
              </button>
              <button
                type="button"
                className={`butang-hantu px-3 ${panduan ? 'border-zamrud-400/70 text-zamrud-300' : ''}`}
                onClick={() => setPanduan((s) => !s)}
                aria-pressed={panduan}
                aria-label="Panduan kawasan selamat TikTok"
                title="Panduan kawasan selamat (G)"
              >
                <IkonGrid />
              </button>
              <button type="button" className="butang-hantu px-3" onClick={togolSkrinPenuh} aria-label="Skrin penuh" title="Skrin penuh (F)">
                <IkonSkrinPenuh />
              </button>
              <button
                type="button"
                className="butang-hantu px-3"
                onClick={(e) => {
                  e.stopPropagation()
                  sembunyi()
                }}
                aria-label="Sembunyikan kawalan"
                title="Sembunyikan kawalan (H)"
              >
                <IkonMataTutup />
              </button>
              <button type="button" className="butang-hantu px-3" onClick={onTutup} aria-label="Tutup persembahan TikTok" title="Tutup (Esc)">
                <IkonTutup />
              </button>
            </div>
          </div>
          <p className="mt-2 hidden text-center text-[0.7rem] text-slate-500 md:block">
            Ruang = Mula/Jeda · ← → = Bahagian · R = Ulang · H = Sembunyi kawalan · G = Kawasan selamat · F = Skrin penuh · Esc = Tutup ·
            Eksport MP4 = video 1080×1920 siap tanpa perakam skrin.
          </p>
        </div>
      )}
    </motion.div>
  )
}

/** Panel menggantikan kod QR dengan imej PNG/JPG sendiri, atau kembali kepada kod yang dijana. */
function PanelKodQr({ onTutup }: { onTutup: () => void }) {
  const kodQr = useKodQrTersuai()
  const [mesej, setMesej] = useState<{ jenis: 'ok' | 'ralat'; teks: string } | null>(null)
  const [memproses, setMemproses] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const berbeza = kodQr && kodQr.teks !== URL_PROMPT

  return (
    <div className="absolute inset-x-3 bottom-full mb-2 sm:left-auto sm:right-5 sm:w-[26rem]">
      <div className="kaca rounded-2xl bg-navy-900/95 p-4 text-sm shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-white">Kod QR adegan akhir</p>
          <button type="button" onClick={onTutup} className="text-slate-400 hover:text-white" aria-label="Tutup panel kod QR">
            <IkonTutup />
          </button>
        </div>
        <p className="mt-1.5 text-slate-400">
          {kodQr ? (
            <>
              Menggunakan imej <span className="text-slate-200">{kodQr.nama}</span>.
            </>
          ) : (
            <>Kod QR dijana automatik daripada pautan master prompt di GitHub.</>
          )}
        </p>
        <p className="mt-2 rounded-lg bg-black/30 px-3 py-2 font-mono text-[0.7rem] break-all text-emas-200">
          {kodQr ? kodQr.teks : URL_PROMPT}
        </p>
        {berbeza && (
          <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] text-emas-200">
            <IkonAmaran className="mt-0.5 shrink-0" /> Kod ini tidak menghala ke pautan master prompt asal.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="butang-emas min-h-9 px-4" disabled={memproses} onClick={() => inputRef.current?.click()}>
            {memproses ? 'Mengimbas…' : 'Ganti dengan imej QR'}
          </button>
          {kodQr && (
            <button
              type="button"
              className="butang-hantu min-h-9 px-4"
              onClick={() => {
                buangKodQrTersuai()
                setMesej({ jenis: 'ok', teks: 'Kembali kepada kod QR yang dijana.' })
              }}
            >
              Guna kod dijana
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={async (e) => {
            const fail = e.target.files?.[0]
            e.target.value = ''
            if (!fail) return
            setMemproses(true)
            const h = await muatNaikKodQr(fail)
            setMemproses(false)
            setMesej(h.ok ? { jenis: 'ok', teks: 'Kod QR dibaca dan digunakan.' } : { jenis: 'ralat', teks: h.mesej })
          }}
        />
        {mesej && (
          <p role="status" className={`mt-2 text-[0.75rem] ${mesej.jenis === 'ok' ? 'text-zamrud-300' : 'text-rose-300'}`}>
            {mesej.teks}
          </p>
        )}
        <p className="mt-2 text-[0.7rem] text-slate-500">
          Imej disemak dengan pembaca QR sebelum digunakan dan disimpan dalam pelayar ini sahaja.
        </p>
      </div>
    </div>
  )
}
