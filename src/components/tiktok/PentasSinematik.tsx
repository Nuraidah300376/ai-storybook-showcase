import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { BUKU, JUMLAH_HALAMAN } from '../../data/buku'
import { TAJUK_PROMPT } from '../../data/masterPrompt'
import { ALIRAN_KERJA, PENTAS, PENUTUP_QR, STRUKTUR_PROMPT, ZON_SELAMAT } from '../../data/tiktok'
import { SEGMEN, kemajuanSegmen, segmenPadaMasa, type JenisSegmen } from '../../lib/garisMasa'
import { BukuSelak } from '../buku/BukuSelak'
import { TajukAnimasi } from '../TajukAnimasi'
import { KodQR } from './KodQR'

interface Props {
  /** Masa persembahan semasa dalam milisaat (0..60000). */
  ms: number
  /** Halaman buku yang dipaparkan (0..11). */
  indeksBuku: number
  /** Berubah apabila persembahan diulang supaya animasi bermula semula. */
  sesi: number
  /** Benar sebelum persembahan pertama kali dimulakan (bingkai sedia). */
  sedia: boolean
  urlQR: string | null
  paparZonSelamat: boolean
}

const { lebar: W, tinggi: H } = PENTAS
const Z = ZON_SELAMAT
/** Kotak kandungan selamat. */
const KOTAK = { x: Z.kiri, y: Z.atas, w: W - Z.kiri - Z.kanan, h: H - Z.atas - Z.bawah }

/** Saiz buku A5 potret dalam piksel pentas. */
const BUKU_H = 910
const BUKU_W = Math.round((BUKU_H * 148) / 210)
const BUKU_Y = 440
/** Paksi tengah mendatar kotak selamat (tidak sama dengan tengah pentas kerana butang TikTok di kanan). */
const CX = KOTAK.x + KOTAK.w / 2

const LICIN = [0.22, 1, 0.36, 1] as const
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)

function seg(jenis: JenisSegmen) {
  return SEGMEN.find((s) => s.jenis === jenis)!
}

/**
 * Pentas TikTok Cinematic Showcase pada kawasan asas 1080×1920 piksel.
 * Diskalakan oleh komponen induk. Setiap pendedahan elemen dikira daripada `ms`
 * supaya Jeda, Ulang dan lompatan garis masa sentiasa konsisten.
 */
export function PentasSinematik({ ms, indeksBuku, sesi, sedia, urlQR, paparZonSelamat }: Props) {
  const segmen = segmenPadaMasa(ms)
  const bukuAktif = segmen.jenis === 'kulit' || segmen.jenis === 'halaman'

  return (
    <div
      className="bijirin relative overflow-hidden bg-navy-950 font-sans text-white select-none"
      style={{ width: W, height: H }}
    >
      <Pencahayaan ms={ms} jenis={segmen.jenis} />

      {/* Buku kekal dipasang sepanjang kulit dan selak halaman supaya setiap pertukaran ialah selakan. */}
      <AnimatePresence>
        {bukuAktif && (
          <motion.div
            key={`buku-${sesi}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.6 } }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <LapisanBuku ms={ms} indeksBuku={indeksBuku} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!sedia && (
          <motion.div
            key={`${sesi}-${segmen.jenis}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            {segmen.jenis === 'hook' && <SegmenHook ms={ms} />}
            {segmen.jenis === 'kulit' && <KapsyenKulit ms={ms} />}
            {segmen.jenis === 'halaman' && <KapsyenHalaman indeksBuku={indeksBuku} />}
            {segmen.jenis === 'struktur' && <SegmenStruktur ms={ms} />}
            {segmen.jenis === 'aliran' && <SegmenAliran ms={ms} />}
            {segmen.jenis === 'qr' && <SegmenQR ms={ms} url={urlQR} />}
          </motion.div>
        )}
      </AnimatePresence>

      <BarKemajuan ms={ms} />
      {segmen.jenis !== 'qr' && <Kredit />}
      {paparZonSelamat && <PanduanZonSelamat />}
    </div>
  )
}

/* ---------- Lapisan tetap ---------- */

function Pencahayaan({ ms, jenis }: { ms: number; jenis: JenisSegmen }) {
  const kurang = useReducedMotion()
  // Cahaya utama bergerak perlahan sepanjang persembahan.
  const t = kurang ? 0 : ms / 1000
  const hangat = jenis === 'hook' || jenis === 'qr'
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(33,58,122,0.85),transparent_70%)]" />
      <div
        className="absolute rounded-full transition-opacity duration-1000"
        style={{
          left: -300 + Math.sin(t * 0.35) * 60,
          top: -260 + Math.cos(t * 0.3) * 40,
          width: 1100,
          height: 1100,
          opacity: hangat ? 1 : 0.7,
          background: 'radial-gradient(circle, rgba(227,182,74,0.26), transparent 62%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: -360 + Math.cos(t * 0.28) * 60,
          bottom: -200 + Math.sin(t * 0.32) * 50,
          width: 1200,
          height: 1200,
          background: 'radial-gradient(circle, rgba(31,163,122,0.24), transparent 62%)',
        }}
      />
      {/* Sinar cahaya lembut dari atas */}
      <div
        className="absolute top-[-200px] left-1/2 h-[1500px] w-[900px] origin-top bg-[linear-gradient(180deg,rgba(246,228,176,0.16),transparent_75%)] [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]"
        style={{ transform: `translateX(-50%) rotate(${Math.sin(t * 0.25) * 4}deg)` }}
      />
      {/* Vignet */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,transparent_55%,rgba(2,5,14,0.85))]" />
    </div>
  )
}

function BarKemajuan({ ms }: { ms: number }) {
  return (
    <div aria-hidden="true" className="absolute flex gap-[8px]" style={{ left: KOTAK.x, width: KOTAK.w, top: Z.atas - 34 }}>
      {SEGMEN.map((s) => (
        <div key={s.jenis} className="h-[7px] overflow-hidden rounded-full bg-white/20" style={{ flex: s.tamatMs - s.mulaMs }}>
          <div className="h-full rounded-full bg-gradient-to-r from-emas-300 to-emas-400" style={{ width: `${kemajuanSegmen(s, ms) * 100}%` }} />
        </div>
      ))}
    </div>
  )
}

function Kredit() {
  return (
    <p
      className="absolute text-center text-[30px] leading-none text-slate-300"
      style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + KOTAK.h - 48 }}
    >
      oleh <span className="font-semibold text-emas-200">{BUKU.pembangun}</span>
    </p>
  )
}

function PanduanZonSelamat() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 bg-red-500/25" style={{ height: Z.atas }} />
      <div className="absolute inset-x-0 bottom-0 bg-red-500/25" style={{ height: Z.bawah }} />
      <div className="absolute right-0 bg-red-500/25" style={{ top: Z.atas, bottom: Z.bawah, width: Z.kanan }} />
      <div className="absolute left-0 bg-red-500/15" style={{ top: Z.atas, bottom: Z.bawah, width: Z.kiri }} />
      <div className="absolute border-4 border-dashed border-zamrud-300" style={{ left: KOTAK.x, top: KOTAK.y, width: KOTAK.w, height: KOTAK.h }} />
      <p className="absolute top-[90px] left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-6 py-2 text-[28px] whitespace-nowrap text-zamrud-200">
        Zon selamat TikTok (panduan, tidak dirakam jika dimatikan)
      </p>
    </div>
  )
}

/** Muncul apabila `aktif`; animasi dimainkan semula setiap kali keadaan bertukar. */
function Muncul({
  aktif,
  children,
  className = '',
  style,
  dari = 40,
}: {
  aktif: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  dari?: number
}) {
  return (
    <motion.div
      initial={false}
      animate={aktif ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: dari, scale: 0.97 }}
      transition={{ duration: 0.7, ease: LICIN }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/** Label kecil berhuruf besar dengan garis emas. */
function Label({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-[18px] text-[30px] font-semibold tracking-[0.28em] text-emas-300 uppercase">
      <span className="h-[2px] w-[60px] bg-gradient-to-r from-transparent to-emas-400" />
      {children}
      <span className="h-[2px] w-[60px] bg-gradient-to-l from-transparent to-emas-400" />
    </p>
  )
}

/* ---------- 0–5 s: Hook ---------- */

function SegmenHook({ ms }: { ms: number }) {
  return (
    <div className="absolute flex flex-col items-center text-center" style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + 70 }}>
      <Muncul aktif={ms > 150} dari={20}>
        <Label>Master Prompt Premium</Label>
      </Muncul>
      <h2 className="font-display mt-[56px] text-[156px] leading-[0.94] font-bold [perspective:1200px]">
        <TajukAnimasi baris={['SATU', 'PROMPT,', 'SEBUAH', 'BUKU', 'CERITA!']} lewat={0.3} />
      </h2>
      <Muncul aktif={ms > 2700} className="mt-[60px]">
        <p className="rounded-full border-2 border-zamrud-400/60 bg-zamrud-500/15 px-[40px] py-[16px] text-[38px] font-semibold text-zamrud-200">
          Buku cerita bergambar berhalaman
        </p>
      </Muncul>
    </div>
  )
}

/* ---------- 5–35 s: Buku ---------- */

function LapisanBuku({ ms, indeksBuku }: { ms: number; indeksBuku: number }) {
  const kurang = useReducedMotion()
  const kulit = seg('kulit')
  const halaman = seg('halaman')

  // Kamera: buku masuk dalam keadaan condong 3D, kemudian rata dan zum perlahan.
  let skala = 1
  let putarY = 0
  let putarX = 0
  let anjakY = 0
  if (!kurang) {
    if (ms < halaman.mulaMs) {
      const e = easeOut((ms - kulit.mulaMs) / 3200)
      putarY = -24 * (1 - e)
      putarX = 12 * (1 - e)
      anjakY = 80 * (1 - e)
      skala = 0.8 + 0.2 * e + 0.03 * Math.max(0, (ms - kulit.mulaMs - 3200) / 3800)
    } else {
      const p = kemajuanSegmen(halaman, ms)
      skala = 1.02 + 0.04 * p
      putarY = Math.sin(p * Math.PI * 3) * 1.2
      anjakY = -10 * p
    }
  }

  // Kilauan cahaya yang menyapu kulit buku sekali.
  const kilau = Math.min(1, Math.max(0, (ms - kulit.mulaMs - 2600) / 1800))

  return (
    <div className="absolute inset-0 [perspective:2600px]">
      {/* Lampu sorot di belakang buku */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          left: CX - 560,
          top: BUKU_Y + BUKU_H / 2 - 560,
          width: 1120,
          height: 1120,
          background: 'radial-gradient(circle, rgba(246,228,176,0.22), rgba(227,182,74,0.08) 40%, transparent 65%)',
        }}
      />
      <div
        className="absolute"
        style={{
          left: CX - BUKU_W / 2,
          top: BUKU_Y,
          width: BUKU_W,
          height: BUKU_H,
          transform: `translateY(${anjakY}px) rotateX(${putarX}deg) rotateY(${putarY}deg) scale(${skala})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <BukuSelak indeks={indeksBuku} mod="tunggal" tempohMs={900} className="h-full w-full" />
        {/* Sapuan cahaya: lapisan di atas buku, imej asal tidak diubah. */}
        {kilau > 0 && kilau < 1 && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-r-[14px]">
            <div
              className="absolute inset-y-[-20%] w-[45%] rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent"
              style={{ left: `${-50 + kilau * 160}%` }}
            />
          </div>
        )}
      </div>
      {/* Bayang lantai */}
      <div
        aria-hidden="true"
        className="absolute h-[70px] rounded-[50%] bg-black/60 blur-[24px]"
        style={{ left: CX - BUKU_W * 0.45, width: BUKU_W * 0.9, top: BUKU_Y + BUKU_H + 6 }}
      />
    </div>
  )
}

function KapsyenAtas({ children }: { children: ReactNode }) {
  return (
    <div className="absolute flex flex-col items-center text-center" style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + 12 }}>
      {children}
    </div>
  )
}

function KapsyenKulit({ ms }: { ms: number }) {
  const kulit = seg('kulit')
  return (
    <KapsyenAtas>
      <Muncul aktif={ms > kulit.mulaMs + 200} dari={20}>
        <Label>Hasil sebenar</Label>
      </Muncul>
      <Muncul aktif={ms > kulit.mulaMs + 600} dari={24} className="mt-[14px]">
        <p className="font-display teks-emas text-[62px] leading-tight font-bold whitespace-nowrap italic">{BUKU.tajuk}</p>
      </Muncul>
    </KapsyenAtas>
  )
}

function KapsyenHalaman({ indeksBuku }: { indeksBuku: number }) {
  return (
    <KapsyenAtas>
      <Label>Selak halaman</Label>
      <div className="mt-[18px] flex items-baseline gap-[16px]">
        <span className="text-[40px] font-semibold text-slate-200">Halaman</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={indeksBuku}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: LICIN }}
            className="font-display teks-emas text-[76px] leading-none font-bold tabular-nums"
          >
            {String(indeksBuku + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span className="text-[40px] font-semibold text-slate-400 tabular-nums">/ {JUMLAH_HALAMAN}</span>
      </div>
    </KapsyenAtas>
  )
}

/* ---------- 35–45 s: Struktur master prompt ---------- */

function SegmenStruktur({ ms }: { ms: number }) {
  const s = seg('struktur')
  const t = ms - s.mulaMs
  return (
    <div className="absolute flex flex-col items-center" style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + 20 }}>
      <Muncul aktif={t > 100} dari={20}>
        <Label>Di sebalik buku ini</Label>
      </Muncul>
      <Muncul aktif={t > 400} className="mt-[22px] text-center">
        <h2 className="font-display text-[86px] leading-[1] font-bold">
          Struktur
          <br />
          <span className="teks-emas">Master Prompt</span>
        </h2>
      </Muncul>
      <ol className="mt-[48px] flex w-full flex-col gap-[18px]">
        {STRUKTUR_PROMPT.map((b, i) => {
          const aktif = t > 1300 + i * 1300
          return (
            <li key={b.tajuk}>
              <Muncul aktif={aktif} dari={50}>
                <div className="flex items-center gap-[28px] rounded-[28px] border-2 border-white/12 bg-navy-800/80 px-[30px] py-[22px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
                  <span className="font-display grid size-[86px] shrink-0 place-items-center rounded-[22px] bg-gradient-to-br from-emas-300 to-emas-500 text-[44px] font-bold text-navy-950">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[42px] leading-tight font-bold text-white">{b.tajuk}</p>
                    <p className="mt-[4px] text-[30px] leading-snug text-slate-300">{b.huraian}</p>
                  </div>
                </div>
              </Muncul>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------- 45–52 s: RANCANG → LULUS → JANA SATU HALAMAN ---------- */

function SegmenAliran({ ms }: { ms: number }) {
  const s = seg('aliran')
  const t = ms - s.mulaMs
  const aktifSehingga = t < 900 ? -1 : Math.min(ALIRAN_KERJA.length - 1, Math.floor((t - 900) / 1700))
  return (
    <div className="absolute flex flex-col items-center text-center" style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + 20 }}>
      <Muncul aktif={t > 100} dari={20}>
        <Label>Aliran kerja</Label>
      </Muncul>
      <Muncul aktif={t > 300} className="mt-[22px]">
        <h2 className="font-display text-[80px] leading-[1.02] font-bold">
          Tiga langkah,
          <br />
          <span className="teks-emas">satu buku</span>
        </h2>
      </Muncul>
      <ol className="mt-[54px] flex w-full flex-col items-center">
        {ALIRAN_KERJA.map((l, i) => {
          const aktif = i <= aktifSehingga
          const semasa = i === aktifSehingga
          return (
            <li key={l.langkah} className="flex w-full flex-col items-center">
              {i > 0 && (
                <motion.svg
                  viewBox="0 0 24 40"
                  className="my-[10px] h-[64px] w-[40px]"
                  initial={false}
                  animate={{ opacity: aktif ? 1 : 0.2 }}
                  aria-hidden="true"
                >
                  <path d="M12 2v30M4 24l8 10 8-10" fill="none" stroke="#e3b64a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
              <motion.div
                initial={false}
                animate={{
                  opacity: aktif ? 1 : 0.28,
                  scale: semasa ? 1.04 : 1,
                  boxShadow: semasa ? '0 0 0 4px rgba(239,208,133,0.9), 0 0 70px rgba(227,182,74,0.45)' : '0 0 0 2px rgba(255,255,255,0.12), 0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.5, ease: LICIN }}
                className={`flex w-full items-center gap-[28px] rounded-[32px] px-[34px] py-[28px] text-left ${
                  i === ALIRAN_KERJA.length - 1 ? 'bg-gradient-to-br from-zamrud-600/60 to-navy-800' : 'bg-navy-800/85'
                }`}
              >
                <span className="font-display grid size-[92px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-emas-300 to-emas-500 text-[48px] font-bold text-navy-950">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[52px] leading-[1.05] font-extrabold tracking-wide text-white">{l.langkah}</p>
                  <p className="mt-[6px] text-[30px] leading-snug text-slate-200">{l.huraian}</p>
                </div>
              </motion.div>
            </li>
          )
        })}
      </ol>
      <Muncul aktif={aktifSehingga >= ALIRAN_KERJA.length - 1} className="mt-[30px]">
        <p className="text-[32px] text-zamrud-200">↻ Ulang langkah 3 untuk setiap halaman</p>
      </Muncul>
    </div>
  )
}

/* ---------- 52–60 s: Kod QR ---------- */

function SegmenQR({ ms, url }: { ms: number; url: string | null }) {
  const s = seg('qr')
  const t = ms - s.mulaMs
  const saizQR = 500
  return (
    <div className="absolute flex flex-col items-center text-center" style={{ left: KOTAK.x, width: KOTAK.w, top: KOTAK.y + 10 }}>
      <Muncul aktif={t > 100} dari={20}>
        <p className="text-[26px] font-semibold tracking-[0.2em] text-emas-300 uppercase">{TAJUK_PROMPT.split(' — ')[0]}</p>
      </Muncul>
      <Muncul aktif={t > 300} className="mt-[16px]">
        <h2 className="font-display text-[76px] leading-[1.02] font-bold">
          {PENUTUP_QR.tajuk.replace('MASTER PROMPT PENUH', '')}
          <br />
          <span className="teks-emas text-[64px] whitespace-nowrap">MASTER PROMPT PENUH</span>
        </h2>
      </Muncul>
      <Muncul aktif={t > 700} className="mt-[40px]">
        <div className="rounded-[40px] bg-gradient-to-br from-emas-300 via-emas-500 to-zamrud-500 p-[10px] shadow-[0_30px_80px_-20px_rgba(227,182,74,0.55)]">
          <div className={`rounded-[32px] p-[22px] ${url ? 'bg-white' : 'bg-navy-950'}`}>
            <KodQR url={url} saiz={saizQR} />
          </div>
        </div>
      </Muncul>
      <Muncul aktif={t > 1400} className="mt-[40px] w-full">
        {url ? (
          <ol className="space-y-[12px] text-[34px] leading-snug text-slate-100">
            {PENUTUP_QR.arahan.map((a, i) => (
              <li key={a} className="flex items-center justify-center gap-[16px]">
                <span className="grid size-[50px] shrink-0 place-items-center rounded-full bg-zamrud-500 text-[28px] font-bold text-navy-950">{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[34px] leading-snug text-slate-200">{PENUTUP_QR.arahanTanpaQR}</p>
        )}
      </Muncul>
      <Muncul aktif={t > 2000} className="mt-[34px]">
        <p className="text-[28px] text-slate-400">Penulis &amp; Pembangun</p>
        <p className="font-display mt-[4px] text-[44px] font-bold text-emas-200">{BUKU.pembangun}</p>
      </Muncul>
    </div>
  )
}
