/**
 * Logik tulen untuk animasi selak halaman.
 *
 * Setiap halaman ialah satu imej A5 potret penuh (ilustrasi dan teks sudah
 * terkandung dalam imej).
 *
 * - `tunggal`: kedudukan buku = indeks halaman (0..11).
 * - `hamparan`: kedudukan buku = indeks hamparan dua muka (0..5); hamparan s
 *   memaparkan halaman 2s di kiri dan 2s+1 di kanan.
 *
 * Kedudukan -1 mewakili halaman judul (dipaparkan sebelum halaman pertama
 * dalam mod persembahan).
 */

export type ModBuku = 'hamparan' | 'tunggal'

/** Muka yang boleh dilukis pada sekeping kertas. */
export type Muka =
  | { sisi: 'kiri'; indeks: number } // muka kiri hamparan `indeks`
  | { sisi: 'kanan'; indeks: number } // muka kanan hamparan `indeks`
  | { sisi: 'penuh'; indeks: number } // halaman `indeks` (tunggal)
  | { sisi: 'belakang' } // belakang kertas kosong

export interface Selakan {
  dari: number
  ke: number
}

export interface Daun {
  /** Kedudukan helaian yang diselak. */
  pada: 'kiri' | 'kanan' | 'penuh'
  depan: Muka
  belakang: Muka
  /** Tunggal sahaja: helaian masuk menutup halaman (selak ke belakang). */
  masuk: boolean
}

export interface SusunanMuka {
  /** Halaman statik di bawah helaian. Hamparan: [kiri, kanan]. Tunggal: [penuh]. */
  statik: Muka[]
  daun: Daun | null
}

/** Sudut maksimum helaian dalam mod tunggal: sedikit melepasi tegak, kemudian dipotong di tulang buku. */
export const SUDUT_TUNGGAL = 92

export function sudutMaks(mod: ModBuku): number {
  return mod === 'hamparan' ? 180 : SUDUT_TUNGGAL
}

/** Hamparan yang memaparkan halaman `indeks`: halaman 1–2 → 0, 3–4 → 1, …; judul (-1) → -1. */
export function hamparanBagi(indeks: number): number {
  return indeks < 0 ? -1 : Math.floor(indeks / 2)
}

/** Kedudukan buku bagi halaman `indeks` dalam mod tertentu. */
export function kedudukanBuku(mod: ModBuku, indeks: number): number {
  return mod === 'hamparan' ? hamparanBagi(indeks) : indeks
}

/**
 * Indeks halaman yang dilukis pada satu muka, atau -1 untuk halaman judul /
 * kertas hujung. `null` untuk belakang kertas kosong.
 */
export function halamanPadaMuka(muka: Muka): number | null {
  if (muka.sisi === 'belakang') return null
  if (muka.sisi === 'penuh' || muka.indeks < 0) return muka.indeks
  return muka.indeks * 2 + (muka.sisi === 'kanan' ? 1 : 0)
}

const kiri = (indeks: number): Muka => ({ sisi: 'kiri', indeks })
const kanan = (indeks: number): Muka => ({ sisi: 'kanan', indeks })
const penuh = (indeks: number): Muka => ({ sisi: 'penuh', indeks })
const belakang: Muka = { sisi: 'belakang' }

/** Tentukan muka mana dilukis di mana, bagi keadaan semasa buku. */
export function susunMuka(mod: ModBuku, paparan: number, selakan: Selakan | null): SusunanMuka {
  if (mod === 'hamparan') {
    if (!selakan) return { statik: [kiri(paparan), kanan(paparan)], daun: null }
    const { dari, ke } = selakan
    if (ke > dari) {
      // Helaian kanan berpusing ke kiri: depan = muka kanan lama, belakang = muka kiri baharu.
      return {
        statik: [kiri(dari), kanan(ke)],
        daun: { pada: 'kanan', depan: kanan(dari), belakang: kiri(ke), masuk: false },
      }
    }
    // Helaian kiri berpusing ke kanan: depan = muka kiri lama, belakang = muka kanan baharu.
    return {
      statik: [kiri(ke), kanan(dari)],
      daun: { pada: 'kiri', depan: kiri(dari), belakang: kanan(ke), masuk: false },
    }
  }

  if (!selakan) return { statik: [penuh(paparan)], daun: null }
  const { dari, ke } = selakan
  if (ke > dari) {
    // Halaman semasa diangkat dari tulang kiri, mendedahkan halaman baharu di bawahnya.
    return { statik: [penuh(ke)], daun: { pada: 'penuh', depan: penuh(dari), belakang, masuk: false } }
  }
  // Halaman sebelumnya kembali menutup halaman semasa.
  return { statik: [penuh(dari)], daun: { pada: 'penuh', depan: penuh(ke), belakang, masuk: true } }
}

/**
 * Sudut putaran CSS rotateY (darjah) bagi helaian, diberi kemajuan sudut 0..sudutMaks.
 * Negatif = berpusing ke kiri.
 */
export function sudutPutaran(mod: ModBuku, daun: Daun, sudut: number): number {
  if (mod === 'hamparan') return daun.pada === 'kanan' ? -sudut : sudut
  return daun.masuk ? -(SUDUT_TUNGGAL - sudut) : -sudut
}
