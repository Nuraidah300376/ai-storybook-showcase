/**
 * Logik tulen untuk animasi selak halaman.
 *
 * Indeks halaman bermula dari 0. Indeks -1 mewakili halaman judul
 * (dipaparkan sebelum halaman pertama dalam mod persembahan).
 */

export type ModBuku = 'hamparan' | 'tunggal'

/** Muka yang boleh dilukis pada sekeping kertas. */
export type Muka =
  | { sisi: 'kiri'; indeks: number } // ilustrasi (hamparan)
  | { sisi: 'kanan'; indeks: number } // teks (hamparan)
  | { sisi: 'penuh'; indeks: number } // ilustrasi + teks (tunggal)
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
      // Helaian kanan berpusing ke kiri: depan = teks lama, belakang = ilustrasi baharu.
      return {
        statik: [kiri(dari), kanan(ke)],
        daun: { pada: 'kanan', depan: kanan(dari), belakang: kiri(ke), masuk: false },
      }
    }
    // Helaian kiri berpusing ke kanan: depan = ilustrasi lama, belakang = teks baharu.
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
