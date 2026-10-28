import { HALAMAN, type Halaman } from './buku'

export type Slaid = { jenis: 'pembukaan' } | { jenis: 'halaman'; halaman: Halaman } | { jenis: 'penutup' }

export const SLAID: Slaid[] = [
  { jenis: 'pembukaan' },
  ...HALAMAN.map((halaman) => ({ jenis: 'halaman' as const, halaman })),
  { jenis: 'penutup' },
]

/** Tempoh paparan setiap slaid dalam milisaat. */
export const TEMPOH_MS = {
  pembukaan: 4500,
  halaman: 6000,
  penutup: 5500,
} as const

export function tempohSlaid(indeks: number): number {
  return TEMPOH_MS[SLAID[indeks].jenis]
}
