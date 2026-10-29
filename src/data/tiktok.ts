import { HALAMAN } from './buku'

/**
 * Garis masa persembahan TikTok 60 saat (Fasa 3): berkongsi master prompt
 * buku cerita bergambar. Setiap adegan mempunyai tempoh tetap supaya jumlahnya
 * tepat 60 saat.
 */

export type JenisAdegan = 'hook' | 'kulit' | 'halaman' | 'kelebihan' | 'proses' | 'qr'

export interface Adegan {
  jenis: JenisAdegan
  tempohMs: number
  /** Kapsyen ringkas di bahagian bawah kawasan selamat. */
  kapsyen: string
  /** Adegan `halaman` sahaja: indeks halaman 0..11. */
  halaman?: number
}

/** Tempoh bahagian halaman (12–35 s) dan agihannya: halaman 12 kekal lebih lama sebelum adegan seterusnya. */
const TEMPOH_BAHAGIAN_HALAMAN = 23_000
const TEMPOH_SATU_HALAMAN = 1_900

export const TEMPOH_SELAK_MS = 650

export const ADEGAN: Adegan[] = [
  { jenis: 'hook', tempohMs: 5_000, kapsyen: 'Satu master prompt → 12 halaman buku cerita' },
  { jenis: 'kulit', tempohMs: 7_000, kapsyen: 'Kulit hadapan dijana dahulu, sebelum halaman lain' },
  ...HALAMAN.map((_, i) => ({
    jenis: 'halaman' as const,
    halaman: i,
    tempohMs: i < HALAMAN.length - 1 ? TEMPOH_SATU_HALAMAN : TEMPOH_BAHAGIAN_HALAMAN - TEMPOH_SATU_HALAMAN * (HALAMAN.length - 1),
    kapsyen: 'Satu halaman pada satu masa · watak kekal sama',
  })),
  { jenis: 'kelebihan', tempohMs: 10_000, kapsyen: 'Semua ini tertulis dalam master prompt asal' },
  { jenis: 'proses', tempohMs: 7_000, kapsyen: 'Taip “TERUSKAN” untuk halaman seterusnya' },
  { jenis: 'qr', tempohMs: 8_000, kapsyen: 'Imbas · Salin · Cuba sendiri' },
]

export const JUMLAH_MS = ADEGAN.reduce((s, a) => s + a.tempohMs, 0)

/** Masa mula (ms) setiap adegan dalam garis masa. */
export const MULA_MS: number[] = ADEGAN.map((_, i) => ADEGAN.slice(0, i).reduce((s, a) => s + a.tempohMs, 0))

export function tempohAdegan(indeks: number): number {
  return ADEGAN[indeks].tempohMs
}

/** Indeks adegan pertama bagi satu jenis (untuk navigasi antara bahagian). */
export function indeksBahagian(jenis: JenisAdegan): number {
  return ADEGAN.findIndex((a) => a.jenis === jenis)
}

/** Senarai bahagian unik mengikut urutan (halaman 1–12 dikira satu bahagian). */
export const BAHAGIAN: JenisAdegan[] = ADEGAN.map((a) => a.jenis).filter((j, i, s) => s.indexOf(j) === i)

export const NAMA_BAHAGIAN: Record<JenisAdegan, string> = {
  hook: 'Hook',
  kulit: 'Kulit hadapan',
  halaman: '12 halaman',
  kelebihan: 'Kelebihan',
  proses: 'Proses',
  qr: 'Kod QR',
}

/**
 * Empat kelebihan master prompt. Setiap `bukti` ialah frasa yang wujud dalam
 * master prompt asal (disemak oleh ujian unit).
 */
export const KELEBIHAN = [
  {
    tajuk: 'Konsistensi watak',
    huraian: 'Profil watak ditetapkan dahulu: wajah, rambut dan pakaian kekal sama hingga halaman terakhir.',
    bukti: 'KONSISTENSI WATAK — WAJIB',
  },
  {
    tajuk: 'Satu halaman pada satu masa',
    huraian: 'Bukan kolaj atau poster gabungan. Setiap halaman satu reka bentuk lengkap.',
    bukti: 'SATU ARAHAN = SATU HALAMAN',
  },
  {
    tajuk: 'Naratif tersusun',
    huraian: 'Permulaan → perkembangan → klimaks → peleraian, dengan kesinambungan antara halaman.',
    bukti: 'STRUKTUR CERITA',
  },
  {
    tajuk: 'Reka bentuk premium',
    huraian: 'A5 potret, ilustrasi 60–75% ruang, tipografi mesra pembaca, sedia untuk cetakan.',
    bukti: 'Premium Illustrated Storybook',
  },
] as const

/** Tiga langkah protokol penjanaan dalam master prompt. */
export const LANGKAH = [
  { tajuk: 'RANCANG', huraian: 'AI sediakan pelan, profil watak dan teks setiap halaman — tanpa ilustrasi.', bukti: 'FASA 1 — PERANCANGAN' },
  { tajuk: 'LULUS', huraian: 'Semak pelan, kemudian taip “LULUS”.', bukti: 'FASA 2 — SEMAKAN DAN KELULUSAN' },
  { tajuk: 'JANA SATU HALAMAN', huraian: 'Kulit hadapan dahulu, kemudian satu halaman bagi setiap “TERUSKAN”.', bukti: 'FASA 3 — PENJANAAN BERHALAMAN' },
] as const
