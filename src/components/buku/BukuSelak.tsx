import { animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from 'motion/react'
import { memo, useEffect, useRef, useState, type ReactNode } from 'react'
import { sudutMaks, sudutPutaran, susunMuka, type Daun, type ModBuku, type Selakan } from '../../lib/selak'
import { MukaHalaman, type KonteksBuku } from './MukaHalaman'

/** Lengkung selak: angkat perlahan, pusing laju, mendarat lembut. */
const LENGKUNG = [0.5, 0.05, 0.25, 1] as const

interface Props {
  /** Halaman sasaran (0..11). Buku menyelak ke sini apabila nilai ini berubah. */
  indeks: number
  mod: ModBuku
  konteks: KonteksBuku
  /** Tempoh satu selakan dalam milisaat. */
  tempohMs?: number
  /** Mula dari halaman judul dan terus selak ke `indeks` (untuk mod persembahan). */
  mulaDariJudul?: boolean
  /** Ketik sisi kiri/kanan atau leret untuk menyelak (mod baca). */
  onNavigasi?: (arah: 1 | -1) => void
  className?: string
}

/**
 * Buku dengan animasi selak halaman 3D.
 *
 * - `hamparan`: buku terbuka dua muka; helaian berpusing 180° di tulang tengah.
 * - `tunggal`: satu halaman; helaian diangkat dari tulang kiri.
 *
 * Klik berulang tidak bertindih: selakan semasa dipercepat, kemudian buku
 * menyelak terus ke halaman sasaran terkini.
 */
export const BukuSelak = memo(function BukuSelak({
  indeks,
  mod,
  konteks,
  tempohMs = 750,
  mulaDariJudul = false,
  onNavigasi,
  className = '',
}: Props) {
  const kurangGerak = useReducedMotion()
  const akar = useRef<HTMLDivElement>(null)
  const berseret = useRef(false)
  const [paparan, setPaparan] = useState(mulaDariJudul ? -1 : indeks)
  const [selakan, setSelakan] = useState<Selakan | null>(null)

  // Mulakan selakan baharu apabila sasaran berbeza dan tiada selakan berjalan.
  useEffect(() => {
    if (selakan || indeks === paparan) return
    if (kurangGerak) {
      setPaparan(indeks)
      return
    }
    // Jeda singkat pada halaman judul supaya penonton sempat membacanya.
    const t = window.setTimeout(() => setSelakan({ dari: paparan, ke: indeks }), paparan < 0 ? 600 : 0)
    return () => window.clearTimeout(t)
  }, [indeks, paparan, selakan, kurangGerak])

  const susunan = susunMuka(mod, paparan, selakan)
  const hamparan = mod === 'hamparan'

  return (
    <motion.div
      className={`@container relative touch-pan-y select-none ${onNavigasi ? 'cursor-pointer' : ''} ${className}`}
      ref={akar}
      onPointerDown={() => {
        berseret.current = false
      }}
      onPanStart={() => {
        berseret.current = true
      }}
      onTap={
        onNavigasi
          ? (_, info) => {
              // Seretan sudah dikendalikan oleh onPanEnd; jangan selak dua kali.
              if (berseret.current) return
              const r = akar.current?.getBoundingClientRect()
              if (!r) return
              // info.point ialah koordinat halaman; tukar kepada koordinat tetingkap.
              onNavigasi(info.point.x - window.scrollX - r.left > r.width / 2 ? 1 : -1)
            }
          : undefined
      }
      onPanEnd={
        onNavigasi
          ? (_, info) => {
              if (Math.abs(info.offset.x) < 50 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return
              onNavigasi(info.offset.x < 0 ? 1 : -1)
            }
          : undefined
      }
    >
      {/* Kulit buku dan lapisan helaian di tepi */}
      <div
        aria-hidden="true"
        className={`absolute rounded-[1.4cqw] border border-emas-500/40 bg-gradient-to-b from-navy-700 to-navy-900 shadow-[0_3cqw_6cqw_-1cqw_rgba(0,0,0,0.7)] ${
          hamparan ? '-inset-[1.1cqw]' : '-inset-[2.4cqw] left-[-3.2cqw]'
        }`}
      />
      <LapisanHelaian hamparan={hamparan} />

      <div
        className="absolute inset-0"
        style={{
          // Jarak perspektif relatif kepada lebar buku: cukup untuk rasa 3D tanpa helaian membonjol keluar bingkai.
          perspective: hamparan ? '320cqw' : '440cqw',
          // Mod tunggal: potong helaian yang melepasi tulang kiri, tetapi benarkan ia terangkat ke atas/bawah/kanan.
          clipPath: hamparan ? undefined : 'inset(-30% -30% -30% 0)',
        }}
      >
        {/* Halaman statik */}
        {hamparan ? (
          <>
            <Kertas pada="kiri">
              <MukaHalaman muka={susunan.statik[0]} mod={mod} konteks={konteks} />
            </Kertas>
            <Kertas pada="kanan">
              <MukaHalaman muka={susunan.statik[1]} mod={mod} konteks={konteks} />
            </Kertas>
            {/* Tulang buku */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[0.5cqw] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/50 to-transparent" />
          </>
        ) : (
          <Kertas pada="penuh">
            <MukaHalaman muka={susunan.statik[0]} mod={mod} konteks={konteks} />
          </Kertas>
        )}

        {selakan && susunan.daun && (
          <Helaian
            key={`${mod}:${selakan.dari}>${selakan.ke}`}
            daun={susunan.daun}
            mod={mod}
            konteks={konteks}
            tempohMs={tempohMs}
            dipercepat={indeks !== selakan.ke}
            onSelesai={() => {
              setPaparan(selakan.ke)
              setSelakan(null)
            }}
          />
        )}
      </div>

      {/* Garis tulang kiri untuk mod tunggal */}
      {!hamparan && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-[1.2cqw] w-[1.6cqw] rounded-l-[0.6cqw] bg-gradient-to-r from-navy-950 via-navy-800 to-black/60"
        />
      )}
    </motion.div>
  )
})

const KEDUDUKAN = {
  kiri: 'left-0 w-1/2 rounded-l-[0.8cqw]',
  kanan: 'left-1/2 w-1/2 rounded-r-[0.8cqw]',
  penuh: 'left-0 w-full rounded-r-[2cqw]',
} as const

function Kertas({ pada, children }: { pada: keyof typeof KEDUDUKAN; children: ReactNode }) {
  return <div className={`absolute inset-y-0 overflow-hidden ${KEDUDUKAN[pada]}`}>{children}</div>
}

/** Tepi helaian yang bertindan, memberi rasa ketebalan buku. */
function LapisanHelaian({ hamparan }: { hamparan: boolean }) {
  const lapisan = [3, 2, 1]
  return (
    <div aria-hidden="true">
      {lapisan.map((n) => (
        <div
          key={n}
          className={`absolute inset-y-0 border border-white/5 ${
            hamparan ? 'inset-x-0 rounded-[0.8cqw]' : 'inset-x-0 rounded-r-[2cqw]'
          }`}
          style={{
            transform: hamparan ? `translateY(${n * 0.22}cqw) scaleX(${1 + n * 0.0025})` : `translate(${n * 0.5}cqw, ${n * 0.35}cqw)`,
            background: n % 2 ? '#132250' : '#0f1c43',
          }}
        />
      ))}
    </div>
  )
}

interface HelaianProps {
  daun: Daun
  mod: ModBuku
  konteks: KonteksBuku
  tempohMs: number
  dipercepat: boolean
  onSelesai: () => void
}

/** Helaian yang sedang diselak. Setiap selakan ialah instans baharu (nilai sudut bermula dari 0). */
function Helaian({ daun, mod, konteks, tempohMs, dipercepat, onSelesai }: HelaianProps) {
  const maks = sudutMaks(mod)
  const sudut = useMotionValue(0)
  const kawalan = useRef<AnimationPlaybackControls | null>(null)
  const selesaiRef = useRef(onSelesai)
  selesaiRef.current = onSelesai

  useEffect(() => {
    let batal = false
    const k = animate(sudut, maks, { duration: tempohMs / 1000, ease: LENGKUNG })
    kawalan.current = k
    k.then(() => {
      if (!batal) selesaiRef.current()
    })
    return () => {
      batal = true
      k.stop()
    }
  }, [sudut, maks, tempohMs])

  // Pengguna menekan lagi semasa selakan: habiskan selakan ini dengan lebih pantas.
  useEffect(() => {
    if (dipercepat && kawalan.current) kawalan.current.speed = 2.2
  }, [dipercepat])

  const putar = useTransform(sudut, (s) => sudutPutaran(mod, daun, s))
  const separuh = maks / 2

  // Bayang pada helaian: paling gelap ketika helaian hampir tegak.
  const bayangDepan = useTransform(sudut, daun.masuk ? [0, maks] : [0, separuh, maks], daun.masuk ? [0.55, 0] : [0, 0.45, 0.6])
  const bayangBelakang = useTransform(sudut, [0, separuh, maks], [0.6, 0.45, 0])
  // Bayang yang dilemparkan helaian ke atas halaman di bawahnya.
  const bayangBawah = useTransform(sudut, [0, maks * 0.25, maks], daun.masuk ? [0.05, 0.25, 0.45] : [0.5, 0.35, 0])
  const bayangMendarat = useTransform(sudut, [0, maks * 0.75, maks], [0, 0.35, 0])
  // Kilauan halus di permukaan kertas yang melengkung.
  const kilau = useTransform(sudut, [0, separuh * 0.6, separuh], [0, 0.22, 0])

  const hamparan = mod === 'hamparan'
  const asal = daun.pada === 'kiri' ? 'right center' : 'left center'
  const arahBayang = daun.pada === 'kiri' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'

  return (
    <>
      {/* Bayang pada halaman statik di bawah helaian */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: bayangBawah }}
        className={`pointer-events-none absolute inset-y-0 ${KEDUDUKAN[daun.pada]} ${arahBayang} from-black via-black/40 to-transparent`}
      />
      {hamparan && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: bayangMendarat }}
          className={`pointer-events-none absolute inset-y-0 ${KEDUDUKAN[daun.pada === 'kiri' ? 'kanan' : 'kiri']} ${
            daun.pada === 'kiri' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'
          } from-black/80 via-black/20 to-transparent`}
        />
      )}

      <motion.div
        className={`absolute inset-y-0 ${KEDUDUKAN[daun.pada]} [transform-style:preserve-3d] [will-change:transform]`}
        style={{ rotateY: putar, transformOrigin: asal }}
      >
        <Sisi>
          <MukaHalaman muka={daun.depan} mod={mod} konteks={konteks} />
          <motion.div style={{ opacity: bayangDepan }} className={`absolute inset-0 ${arahBayang} from-black/70 to-black/20`} />
          <motion.div
            style={{ opacity: kilau }}
            className={`absolute inset-0 ${daun.pada === 'kiri' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-white/60 via-transparent to-transparent`}
          />
        </Sisi>
        <Sisi belakang>
          <MukaHalaman muka={daun.belakang} mod={mod} konteks={konteks} />
          <motion.div style={{ opacity: bayangBelakang }} className={`absolute inset-0 ${arahBayang} from-black/20 to-black/70`} />
        </Sisi>
      </motion.div>
    </>
  )
}

function Sisi({ belakang = false, children }: { belakang?: boolean; children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[inherit] shadow-[0_0_2cqw_rgba(0,0,0,0.35)] [backface-visibility:hidden]"
      style={belakang ? { transform: 'rotateY(180deg)' } : undefined}
    >
      {children}
    </div>
  )
}
