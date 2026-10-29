/**
 * Maklumat buku dan senarai 12 halaman.
 *
 * Setiap halaman ialah satu imej A5 potret penuh (ilustrasi dan teks cerita
 * sudah terkandung dalam imej). 12 imej asal disimpan dalam
 * `public/halaman/halaman-01.png` hingga `halaman-12.png`.
 * Sumber imej mengikut keutamaan:
 *   1. imej yang dimuat naik melalui Pengurus Halaman Buku (storan pelayar);
 *   2. fail `public/halaman/halaman-XX.(webp|jpg|jpeg|png)`;
 *   3. placeholder berlabel.
 * Lihat docs/PANDUAN-IMEJ.md.
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
  /** Label pendek, contohnya "Halaman 01". */
  label: string
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
    label: `Halaman ${String(nombor).padStart(2, '0')}`,
    alt: `Ilustrasi halaman ${nombor} buku ${BUKU.tajuk}`,
  }
})

/** Senarai URL calon imej bagi satu halaman, mengikut urutan cubaan. */
export function calonImej(nombor: number, base: string = import.meta.env.BASE_URL): string[] {
  const nama = namaFailImej(nombor)
  return SAMBUNGAN_IMEJ.map((ext) => `${base}halaman/${nama}.${ext}`)
}
