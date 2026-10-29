import { AnimatePresence, motion } from 'motion/react'
import { useMemo, type ReactNode } from 'react'
import { BUKU, JUMLAH_HALAMAN } from '../../data/buku'
import { MASTER_PROMPT, TAJUK_PROMPT, URL_PROMPT } from '../../data/masterPrompt'
import { ADEGAN, KELEBIHAN, LANGKAH, MULA_MS, TEMPOH_SELAK_MS, indeksBahagian, type JenisAdegan } from '../../data/tiktok'
import type { KodQrTersuai } from '../../lib/kodQrTersuai'
import { BukuSelak } from '../buku/BukuSelak'
import { TajukAnimasi } from '../TajukAnimasi'
import { KodQr } from './KodQr'

/** Saiz asas pentas (piksel reka bentuk). Pentas diskala supaya muat pada sebarang skrin. */
export const LEBAR_PENTAS = 1080
export const TINGGI_PENTAS = 1920

/**
 * Kawasan selamat TikTok pada 1080×1920: elak bar atas, lajur butang di kanan
 * serta kapsyen dan nama pengguna di bawah.
 */
export const KAWASAN_SELAMAT = { atas: 140, bawah: 380, kiri: 64, kanan: 140 } as const

const S = KAWASAN_SELAMAT
const LEBAR_SELAMAT = LEBAR_PENTAS - S.kiri - S.kanan
const PUSAT_X = S.kiri + LEBAR_SELAMAT / 2

/** Kedudukan buku (kulit dan 12 halaman berkongsi buku yang sama). */
const BUKU_LEBAR = 700
const BUKU_ATAS = 390

const LENGKUNG = [0.22, 1, 0.36, 1] as const

const hadkan = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))
const keluarKubik = (t: number) => 1 - (1 - t) ** 3

interface Props {
  indeks: number
  /** Masa keseluruhan garis masa (ms). Animasi kamera diterbitkan daripadanya, jadi Jeda membekukannya. */
  masa: number
  sesi: number
  /** Palsu sebelum Mula ditekan: pentas memaparkan latar sahaja. */
  dimulakan: boolean
  /** Paparkan petunjuk "Tekan Mula" sebelum persembahan bermula. */
  petunjukMula: boolean
  panduanSelamat: boolean
  kodQr: KodQrTersuai | null
}

export function PentasTikTok({ indeks, masa, sesi, dimulakan, petunjukMula, panduanSelamat, kodQr }: Props) {
  const adegan = ADEGAN[indeks]
  const jenis = adegan.jenis
  const tempatan = masa - MULA_MS[indeksBahagian(jenis)]
  const adaBuku = dimulakan && (jenis === 'kulit' || jenis === 'halaman')

  return (
    <div
      className="bijirin relative overflow-hidden bg-navy-950 font-sans text-white"
      style={{ width: LEBAR_PENTAS, height: TINGGI_PENTAS }}
    >
      <Latar masa={masa} />

      <AnimatePresence>
        {adaBuku && (
          <motion.div
            key={`buku-${sesi}`}
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.92, y: -60, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: LENGKUNG }}
          >
            <LapisanBuku masa={masa} halaman={adegan.halaman ?? 0} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dimulakan && (
          <motion.div
            key={`${sesi}-${jenis}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            transition={{ duration: 0.6 }}
          >
            <KandunganAdegan jenis={jenis} tempatan={tempatan} masa={masa} halaman={adegan.halaman ?? 0} kodQr={kodQr} />
          </motion.div>
        )}
      </AnimatePresence>

      {dimulakan && <Kapsyen key={`kapsyen-${sesi}`} teks={adegan.kapsyen} />}

      {!dimulakan && petunjukMula && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="rounded-full border border-emas-400/30 bg-navy-900/70 px-10 py-5 text-[34px] font-semibold text-emas-200">
            Tekan Mula untuk bermula
          </p>
        </div>
      )}

      {panduanSelamat && <PanduanSelamat />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Latar                                                               */
/* ------------------------------------------------------------------ */

function Latar({ masa }: { masa: number }) {
  const s = masa / 1000
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#172a5c_0%,transparent_60%),radial-gradient(ellipse_at_50%_100%,#0d5f4833_0%,transparent_55%)]" />
      <div
        className="absolute h-[900px] w-[900px] rounded-full bg-emas-500/20 blur-[140px]"
        style={{ left: -300 + Math.sin(s * 0.25) * 120, top: -260 + Math.cos(s * 0.2) * 80 }}
      />
      <div
        className="absolute h-[1000px] w-[1000px] rounded-full bg-zamrud-500/20 blur-[150px]"
        style={{ right: -380 + Math.cos(s * 0.22) * 120, bottom: -300 + Math.sin(s * 0.18) * 100 }}
      />
      {/* Sinar cahaya perlahan */}
      <div
        className="absolute -top-[20%] left-1/2 h-[140%] w-[160px] bg-gradient-to-b from-emas-200/10 via-emas-200/5 to-transparent blur-2xl"
        style={{ transform: `translateX(-50%) rotate(${18 + Math.sin(s * 0.3) * 6}deg)`, transformOrigin: 'top center' }}
      />
      {/* Debu emas berkilau */}
      {ZARAH.map((z, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-emas-200"
          style={{
            left: z.x,
            top: (((z.y - s * z.v) % TINGGI_PENTAS) + TINGGI_PENTAS) % TINGGI_PENTAS,
            width: z.r,
            height: z.r,
            opacity: 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(s * z.v * 0.05 + i)),
            boxShadow: '0 0 12px rgba(246,228,176,0.8)',
          }}
        />
      ))}
    </div>
  )
}

/** Kedudukan zarah tetap (bukan rawak) supaya setiap tayangan kelihatan sama. */
const ZARAH = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 397) % LEBAR_PENTAS,
  y: (i * 811) % TINGGI_PENTAS,
  r: 3 + (i % 4) * 1.5,
  v: 18 + (i % 5) * 9,
}))

/* ------------------------------------------------------------------ */
/* Buku: kulit hadapan (5–12 s) dan 12 halaman (12–35 s)              */
/* ------------------------------------------------------------------ */

/** Gerakan kamera pada buku, diterbitkan terus daripada masa garis masa. */
function kameraBuku(masa: number) {
  const masuk = keluarKubik(hadkan((masa - MULA_MS[indeksBahagian('kulit')]) / 2600))
  const tolak = hadkan((masa - 7_600) / (MULA_MS[indeksBahagian('kelebihan')] - 7_600))
  const s = masa / 1000
  return {
    opacity: hadkan((masa - 5_000) / 450),
    transform: [
      `translateY(${160 * (1 - masuk)}px)`,
      `rotateX(${12 * (1 - masuk) + Math.sin(s * 0.6) * 1.2 * masuk}deg)`,
      `rotateY(${-38 * (1 - masuk) + Math.sin(s * 0.4) * 2.5 * masuk}deg)`,
      `scale(${(0.72 + 0.28 * masuk) * (1 + 0.05 * tolak)})`,
    ].join(' '),
  }
}

function LapisanBuku({ masa, halaman }: { masa: number; halaman: number }) {
  const kamera = kameraBuku(masa)
  return (
    <div className="absolute" style={{ left: PUSAT_X - BUKU_LEBAR / 2, top: BUKU_ATAS, width: BUKU_LEBAR, perspective: 2400 }}>
      {/* Cahaya emas di bawah buku */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-[18%] top-[8%] -bottom-[10%] rounded-full bg-[radial-gradient(ellipse,rgba(227,182,74,0.35),transparent_65%)] blur-2xl"
        style={{ opacity: kamera.opacity }}
      />
      <div className="pl-[18px] [transform-style:preserve-3d]" style={kamera}>
        <BukuSelak indeks={halaman} mod="tunggal" tempohMs={TEMPOH_SELAK_MS} className="aspect-[148/210] w-full" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Kandungan setiap adegan                                             */
/* ------------------------------------------------------------------ */

interface KandunganProps {
  jenis: JenisAdegan
  /** Masa sejak bahagian ini bermula (ms). */
  tempatan: number
  masa: number
  halaman: number
  kodQr: KodQrTersuai | null
}

function KandunganAdegan(p: KandunganProps) {
  switch (p.jenis) {
    case 'hook':
      return <AdeganHook masa={p.masa} />
    case 'kulit':
      return <AdeganKulit />
    case 'halaman':
      return <AdeganHalaman halaman={p.halaman} />
    case 'kelebihan':
      return <AdeganKelebihan tempatan={p.tempatan} masa={p.masa} />
    case 'proses':
      return <AdeganProses tempatan={p.tempatan} />
    case 'qr':
      return <AdeganQr tempatan={p.tempatan} kodQr={p.kodQr} />
  }
}

const muncul = (lewat: number, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay: lewat, duration: 0.8, ease: LENGKUNG },
})

/** Kotak kawasan selamat: semua teks penting diletakkan di dalamnya. */
function Selamat({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: S.kiri, right: S.kanan, top: S.atas, bottom: S.bawah }}
    >
      {children}
    </div>
  )
}

function Label({ children, lewat = 0 }: { children: ReactNode; lewat?: number }) {
  return (
    <motion.p {...muncul(lewat, 12)} className="flex items-center justify-center gap-5 text-[26px] font-semibold tracking-[0.32em] text-emas-300 uppercase">
      <span className="h-px w-14 bg-emas-400/70" />
      {children}
      <span className="h-px w-14 bg-emas-400/70" />
    </motion.p>
  )
}

/** Teks master prompt asal yang bertatal perlahan sebagai tekstur latar. */
function TeksPromptBerjalan({ masa, className = '', kelegapan = 0.14 }: { masa: number; className?: string; kelegapan?: number }) {
  const baris = useMemo(() => MASTER_PROMPT.split('\n').filter((b) => b.trim()), [])
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_75%,transparent)] ${className}`}
      style={{ opacity: kelegapan }}
    >
      <div className="font-mono text-[22px] leading-[34px] text-emas-200" style={{ transform: `translateY(${-masa / 40}px)` }}>
        {baris.map((b, i) => (
          <p key={i} className="truncate">
            {b}
          </p>
        ))}
      </div>
    </div>
  )
}

function AdeganHook({ masa }: { masa: number }) {
  return (
    <>
      <div className="absolute inset-0" style={{ perspective: 1600 }}>
        <TeksPromptBerjalan
          masa={masa + 4_000}
          kelegapan={0.16}
          className="left-[90px] top-[220px] h-[1500px] w-[820px] [transform:rotateX(18deg)_rotateZ(-6deg)]"
        />
      </div>
      <Selamat className="flex flex-col items-center justify-center text-center">
        <Label>Master Prompt Premium</Label>
        <h2 className="font-display mt-10 text-[158px] leading-[0.95] font-bold [perspective:900px]">
          <TajukAnimasi baris={['SATU', 'PROMPT,', 'SEBUAH', 'BUKU', 'CERITA!']} lewat={0.15} />
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: LENGKUNG }}
          className="mt-12 h-[3px] w-[420px] bg-gradient-to-r from-transparent via-emas-400 to-transparent"
        />
        <motion.p {...muncul(1.9)} className="mt-10 text-[36px] leading-snug text-slate-200">
          Buku cerita bergambar <span className="font-semibold text-zamrud-300">12 halaman</span>
          <br />
          daripada <span className="font-semibold text-emas-200">satu master prompt</span>
        </motion.p>
      </Selamat>
    </>
  )
}

function AdeganKulit() {
  return (
    <Selamat className="text-center">
      <div className="absolute inset-x-0 top-[22px]">
        <Label lewat={0.1}>Memperkenalkan</Label>
        <motion.p {...muncul(0.35)} className="font-display mt-5 text-[72px] leading-none text-white italic">
          {BUKU.tajuk}
        </motion.p>
        <motion.p {...muncul(0.6)} className="mt-4 text-[32px] text-slate-300">
          karya <span className="font-semibold text-zamrud-300">{BUKU.penulis}</span>
        </motion.p>
      </div>
    </Selamat>
  )
}

function AdeganHalaman({ halaman }: { halaman: number }) {
  return (
    <Selamat>
      <div className="absolute inset-x-[40px] top-[40px]">
        <div className="flex items-end justify-between">
          <motion.p {...muncul(0.1, 12)} className="text-[28px] font-semibold tracking-[0.28em] text-emas-300 uppercase">
            12 halaman · 1 prompt
          </motion.p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={halaman}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3 }}
              className="font-display text-[64px] leading-none font-bold text-white tabular-nums"
            >
              {String(halaman + 1).padStart(2, '0')}
              <span className="text-[34px] font-medium text-slate-400"> / {JUMLAH_HALAMAN}</span>
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex gap-2.5">
          {Array.from({ length: JUMLAH_HALAMAN }, (_, i) => (
            <div key={i} className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emas-300 to-zamrud-400 transition-[width] duration-500 ease-out"
                style={{ width: i <= halaman ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </Selamat>
  )
}

function AdeganKelebihan({ tempatan, masa }: { tempatan: number; masa: number }) {
  return (
    <>
      <TeksPromptBerjalan masa={masa} kelegapan={0.08} className="left-0 top-0 h-full w-full px-16" />
      <Selamat>
        <div className="text-center">
          <Label lewat={0.05}>Kenapa master prompt ini?</Label>
          <motion.h3 {...muncul(0.25)} className="font-display mt-5 text-[78px] leading-none font-bold">
            <span className="teks-emas">4 kelebihan</span> utama
          </motion.h3>
        </div>
        <ol className="mt-12 space-y-5">
          {KELEBIHAN.map((k, i) => {
            const tampak = tempatan >= 500 + i * 1_900
            return (
              <motion.li
                key={k.tajuk}
                initial={false}
                animate={tampak ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 80, rotateY: -25 }}
                transition={{ duration: 0.75, ease: LENGKUNG }}
                className="relative flex gap-7 overflow-hidden rounded-[32px] border border-white/12 bg-navy-800/70 px-8 py-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <span className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-emas-300 to-zamrud-400" />
                <span className="font-display text-[70px] leading-none font-bold text-emas-300/90 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[42px] leading-tight font-bold text-white">{k.tajuk}</p>
                  <p className="mt-2 text-[27px] leading-snug text-slate-300">{k.huraian}</p>
                  <p className="mt-3 truncate font-mono text-[21px] text-zamrud-300">✓ “{k.bukti}”</p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </Selamat>
    </>
  )
}

function AdeganProses({ tempatan }: { tempatan: number }) {
  const MULA_LANGKAH = [300, 2_100, 3_900]
  return (
    <Selamat>
      <div className="text-center">
        <Label lewat={0.05}>Protokol master prompt</Label>
        <motion.h3 {...muncul(0.2)} className="font-display mt-5 text-[58px] leading-[1.05] font-bold whitespace-nowrap">
          Satu arahan = <span className="teks-emas">satu halaman</span>
        </motion.h3>
      </div>
      <div className="relative mx-auto mt-14 w-[820px]">
        {LANGKAH.map((l, i) => {
          const tampak = tempatan >= MULA_LANGKAH[i]
          const aktif = tampak && (i === LANGKAH.length - 1 || tempatan < MULA_LANGKAH[i + 1])
          return (
            <div key={l.tajuk}>
              {i > 0 && (
                <div className="relative ml-[66px] h-[70px] w-[4px] overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={false}
                    animate={{ scaleY: tampak ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full w-full origin-top bg-gradient-to-b from-emas-300 to-zamrud-400"
                  />
                </div>
              )}
              <motion.div
                initial={false}
                animate={tampak ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
                transition={{ duration: 0.7, ease: LENGKUNG }}
                className={`flex items-center gap-8 rounded-[36px] border px-6 py-6 transition-colors duration-500 ${
                  aktif ? 'border-emas-400/60 bg-emas-400/10 shadow-[0_0_60px_-10px_rgba(227,182,74,0.5)]' : 'border-white/10 bg-navy-800/60'
                }`}
              >
                <span
                  className={`grid size-[96px] shrink-0 place-items-center rounded-full border-[3px] text-[46px] font-bold ${
                    aktif ? 'border-emas-300 bg-emas-300 text-navy-950' : 'border-emas-400/60 text-emas-300'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className={`font-display text-[54px] leading-none font-bold ${aktif ? 'teks-emas' : 'text-white'}`}>{l.tajuk}</p>
                  <p className="mt-3 text-[27px] leading-snug text-slate-300">{l.huraian}</p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </Selamat>
  )
}

function AdeganQr({ tempatan, kodQr }: { tempatan: number; kodQr: KodQrTersuai | null }) {
  const SAIZ_QR = 540
  const kilau = (tempatan / 2_400) % 1
  const sasaran = kodQr ? kodQr.teks : URL_PROMPT
  return (
    <Selamat className="text-center">
      <motion.p {...muncul(0.05, 16)} className="text-[50px] leading-tight font-bold tracking-wide text-white">
        IMBAS UNTUK DAPATKAN
      </motion.p>
      <motion.p {...muncul(0.25, 16)} className="font-display teks-emas text-[86px] leading-[1.1] font-bold whitespace-nowrap">
        PROMPT PERCUMA
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateX: 25 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ delay: 0.45, duration: 0.9, ease: LENGKUNG }}
        className="relative mx-auto mt-10"
        style={{ width: SAIZ_QR, height: SAIZ_QR }}
      >
        {/* Bingkai bercahaya di luar kod (tidak menutup modul QR) */}
        <div
          aria-hidden="true"
          className="absolute -inset-[18px] rounded-[48px] p-[4px]"
          style={{
            background: `conic-gradient(from ${kilau * 360}deg, #efd085, #1fa37a, #e3b64a, #6ee7bf, #efd085)`,
            boxShadow: '0 0 80px -10px rgba(227,182,74,0.6)',
          }}
        >
          <div className="h-full w-full rounded-[44px] bg-navy-950" />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-white">
          {kodQr ? (
            <img
              src={kodQr.dataUrl}
              alt={`Kod QR ke ${kodQr.teks}`}
              className="h-full w-full object-contain [image-rendering:pixelated]"
              draggable={false}
            />
          ) : (
            <KodQr teks={URL_PROMPT} className="h-full w-full" />
          )}
        </div>
      </motion.div>

      <motion.div {...muncul(0.9, 12)} className="mt-11">
        <p className="mx-auto max-w-[760px] text-[24px] leading-snug font-semibold tracking-[0.14em] text-emas-300">{TAJUK_PROMPT}</p>
        <p className="mt-3 truncate px-6 text-[23px] text-slate-400">{sasaran.replace(/^https?:\/\//, '')}</p>
      </motion.div>

      <motion.div {...muncul(1.4, 12)} className="mt-9 border-t border-white/10 pt-8">
        <p className="font-display text-[44px] text-white italic">{BUKU.tajuk}</p>
        <p className="mt-2 text-[30px] text-slate-300">
          Penulis &amp; pembangun: <span className="font-semibold text-zamrud-300">{BUKU.pembangun}</span>
        </p>
      </motion.div>
    </Selamat>
  )
}

/* ------------------------------------------------------------------ */
/* Kapsyen dan panduan kawasan selamat                                 */
/* ------------------------------------------------------------------ */

function Kapsyen({ teks }: { teks: string }) {
  return (
    <div className="pointer-events-none absolute flex justify-center" style={{ left: S.kiri, right: S.kanan, bottom: S.bawah + 18 }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={teks}
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.4 }}
          className="rounded-full border border-emas-400/30 bg-navy-950/75 px-9 py-4 text-center text-[31px] leading-tight font-semibold text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          {teks}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/** Lapisan panduan (tidak untuk rakaman): kawasan yang mungkin dilindungi antara muka TikTok. */
function PanduanSelamat() {
  const zon = 'absolute bg-rose-500/25 text-[24px] font-semibold text-rose-100'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className={`${zon} inset-x-0 top-0 grid place-items-center`} style={{ height: S.atas }}>
        Bar atas TikTok
      </div>
      <div className={`${zon} inset-x-0 bottom-0 grid place-items-center`} style={{ height: S.bawah }}>
        Kapsyen, nama pengguna & muzik
      </div>
      <div className={`${zon} right-0 grid place-items-center`} style={{ top: S.atas, bottom: S.bawah, width: S.kanan }}>
        <span className="[writing-mode:vertical-rl]">Butang suka / komen / kongsi</span>
      </div>
      <div className={`${zon}`} style={{ left: 0, top: S.atas, bottom: S.bawah, width: S.kiri }} />
      <div
        className="absolute border-[3px] border-dashed border-zamrud-300"
        style={{ left: S.kiri, right: S.kanan, top: S.atas, bottom: S.bawah }}
      />
    </div>
  )
}
