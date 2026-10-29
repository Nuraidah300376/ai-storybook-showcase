/**
 * Garis masa TikTok Cinematic Showcase (logik tulen, tanpa React).
 *
 * Persembahan dibahagikan kepada segmen; setiap segmen terdiri daripada satu
 * atau lebih "slaid" supaya enjin autoplay sedia ada (lib/autoplay.ts) boleh
 * menggerakkannya. Bahagian selak halaman mempunyai satu slaid bagi setiap
 * halaman yang diselak.
 */

export type JenisSegmen = 'hook' | 'kulit' | 'halaman' | 'struktur' | 'aliran' | 'qr'

export interface Segmen {
  jenis: JenisSegmen
  /** Masa mula dan tamat dalam milisaat dari awal persembahan. */
  mulaMs: number
  tamatMs: number
}

export interface SlaidShowcase {
  segmen: JenisSegmen
  /** Indeks halaman buku (0..11) yang dipaparkan semasa slaid ini. */
  indeksBuku: number
  /** Tempoh slaid dalam milisaat. */
  tempohMs: number
}

/** Susunan segmen persembahan 60 saat (saat mula → saat tamat). */
export const SEGMEN: Segmen[] = [
  { jenis: 'hook', mulaMs: 0, tamatMs: 5_000 },
  { jenis: 'kulit', mulaMs: 5_000, tamatMs: 12_000 },
  { jenis: 'halaman', mulaMs: 12_000, tamatMs: 35_000 },
  { jenis: 'struktur', mulaMs: 35_000, tamatMs: 45_000 },
  { jenis: 'aliran', mulaMs: 45_000, tamatMs: 52_000 },
  { jenis: 'qr', mulaMs: 52_000, tamatMs: 60_000 },
]

export const JUMLAH_MS = SEGMEN[SEGMEN.length - 1].tamatMs

/**
 * Bina senarai slaid. Halaman 1 ialah kulit hadapan; bahagian selak halaman
 * membahagikan tempohnya sama rata kepada halaman 2 hingga `jumlahHalaman`.
 */
export function binaSlaid(jumlahHalaman: number): SlaidShowcase[] {
  const slaid: SlaidShowcase[] = []
  for (const s of SEGMEN) {
    const tempoh = s.tamatMs - s.mulaMs
    if (s.jenis === 'halaman') {
      const bil = Math.max(1, jumlahHalaman - 1)
      // Tempoh dalam milisaat bulat yang jumlahnya tepat sama dengan tempoh segmen,
      // supaya sempadan slaid dan sempadan segmen sentiasa sepadan.
      const sempadan = (i: number) => Math.round((i * tempoh) / bil)
      for (let i = 0; i < bil; i++) {
        slaid.push({ segmen: 'halaman', indeksBuku: Math.min(i + 1, jumlahHalaman - 1), tempohMs: sempadan(i + 1) - sempadan(i) })
      }
    } else {
      // Selepas buku, kekalkan halaman terakhir supaya tiada selakan tambahan.
      const indeksBuku = s.jenis === 'hook' || s.jenis === 'kulit' ? 0 : jumlahHalaman - 1
      slaid.push({ segmen: s.jenis, indeksBuku, tempohMs: tempoh })
    }
  }
  return slaid
}

/** Masa mula setiap slaid (ms), dikira sekali. */
export function masaMulaSlaid(slaid: SlaidShowcase[]): number[] {
  const mula: number[] = []
  let t = 0
  for (const s of slaid) {
    mula.push(t)
    t += s.tempohMs
  }
  return mula
}

/** Masa keseluruhan (ms) berdasarkan slaid semasa dan masa berlalu dalam slaid itu. */
export function masaKeseluruhan(mula: number[], indeks: number, berlalu: number): number {
  return (mula[indeks] ?? 0) + berlalu
}

/** Tukar masa keseluruhan (ms) kepada slaid dan masa berlalu, untuk melompat pada garis masa. */
export function kedudukanPadaMasa(slaid: SlaidShowcase[], ms: number): { indeks: number; berlalu: number } {
  let baki = Math.max(0, ms)
  for (let i = 0; i < slaid.length; i++) {
    if (baki < slaid[i].tempohMs || i === slaid.length - 1) {
      return { indeks: i, berlalu: Math.min(baki, slaid[i].tempohMs) }
    }
    baki -= slaid[i].tempohMs
  }
  return { indeks: 0, berlalu: 0 }
}

export function segmenPadaMasa(ms: number): Segmen {
  return SEGMEN.find((s) => ms < s.tamatMs) ?? SEGMEN[SEGMEN.length - 1]
}

/** Kemajuan 0..1 di dalam segmen yang diberi. */
export function kemajuanSegmen(segmen: Segmen, ms: number): number {
  return Math.min(1, Math.max(0, (ms - segmen.mulaMs) / (segmen.tamatMs - segmen.mulaMs)))
}

/** Format masa sebagai m:ss, contohnya 0:35. */
export function formatMasa(ms: number): string {
  const saat = Math.floor(Math.max(0, ms) / 1000)
  return `${Math.floor(saat / 60)}:${String(saat % 60).padStart(2, '0')}`
}
