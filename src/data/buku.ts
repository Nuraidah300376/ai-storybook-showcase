/**
 * Maklumat buku dan senarai 12 halaman.
 *
 * Imej halaman TIDAK disertakan. Setiap halaman akan cuba memuatkan fail
 * `public/halaman/halaman-XX.(webp|jpg|jpeg|png)`. Jika fail belum wujud,
 * placeholder berlabel dipaparkan. Lihat docs/PANDUAN-IMEJ.md.
 */

export const BUKU = {
  tajuk: 'Amanah Kecil, Hati Besar',
  penulis: 'Nuraidah binti Mustapah',
  pembangun: 'Nuraidah binti Mustapah',
  slogan: 'SATU PROMPT, SEBUAH BUKU CERITA!',
} as const

export const JUMLAH_HALAMAN = 12

/** Sambungan fail yang dicuba mengikut urutan. */
export const SAMBUNGAN_IMEJ = ['webp', 'jpg', 'jpeg', 'png'] as const

export interface Halaman {
  /** Nombor halaman bermula dari 1. */
  nombor: number
  /** Label pendek yang dipaparkan pada placeholder dan lakaran kecil. */
  label: string
  /**
   * Teks cerita halaman ini. Biarkan `null` sehingga teks sebenar dimasukkan;
   * antara muka akan memaparkan nota "teks belum dimasukkan".
   */
  teks: string | null
  /** Teks alternatif untuk pembaca skrin apabila imej sebenar dimasukkan. */
  alt: string
}

export function namaFailImej(nombor: number): string {
  return `halaman-${String(nombor).padStart(2, '0')}`
}

export const HALAMAN: Halaman[] = Array.from({ length: JUMLAH_HALAMAN }, (_, i) => {
  const nombor = i + 1
  return {
    nombor,
    label: `Halaman ${nombor}`,
    teks: null,
    alt: `Ilustrasi halaman ${nombor} buku ${BUKU.tajuk}`,
  }
})

/** Senarai URL calon imej bagi satu halaman, mengikut urutan cubaan. */
export function calonImej(nombor: number, base: string = import.meta.env.BASE_URL): string[] {
  const nama = namaFailImej(nombor)
  return SAMBUNGAN_IMEJ.map((ext) => `${base}halaman/${nama}.${ext}`)
}
