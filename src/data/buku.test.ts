import { describe, expect, it } from 'vitest'
import { HALAMAN, JUMLAH_HALAMAN, calonImej, namaFailImej } from './buku'

describe('data buku', () => {
  it('mempunyai tepat 12 halaman bernombor 1–12', () => {
    expect(JUMLAH_HALAMAN).toBe(12)
    expect(HALAMAN.map((h) => h.nombor)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('menamakan fail imej dengan dua digit', () => {
    expect(namaFailImej(1)).toBe('halaman-01')
    expect(namaFailImej(12)).toBe('halaman-12')
  })

  it('menjana calon URL imej mengikut urutan sambungan', () => {
    expect(calonImej(3, './')).toEqual([
      './halaman/halaman-03.png',
      './halaman/halaman-03.webp',
      './halaman/halaman-03.jpg',
      './halaman/halaman-03.jpeg',
    ])
  })
})

describe('label halaman', () => {
  it('berlabel Halaman 01 hingga Halaman 12', () => {
    expect(HALAMAN[0].label).toBe('Halaman 01')
    expect(HALAMAN[11].label).toBe('Halaman 12')
  })
})
