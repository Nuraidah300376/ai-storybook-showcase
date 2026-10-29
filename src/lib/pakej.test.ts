import { strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { bacaPakej, binaPakej } from './pakej'

const BUKU = { tajuk: 'Amanah Kecil, Hati Besar', penulis: 'Nuraidah binti Mustapah' }
const bait = (...n: number[]) => new Uint8Array(n)

describe('pakej imej', () => {
  it('eksport kemudian import mengekalkan nombor halaman dan bait asal', () => {
    const zip = binaPakej(
      [
        { nombor: 3, nama: 'Gambar C.webp', jenis: 'image/webp', lebar: 148, tinggi: 210, data: bait(3, 3, 3) },
        { nombor: 1, nama: 'Gambar A.png', jenis: 'image/png', lebar: 148, tinggi: 210, data: bait(1, 2, 3, 4) },
      ],
      BUKU,
      12,
    )
    const { fail, konfigurasi } = bacaPakej(zip)
    expect(konfigurasi?.buku.tajuk).toBe(BUKU.tajuk)
    expect(konfigurasi?.halaman.map((h) => h.fail)).toEqual(['halaman/halaman-01.png', 'halaman/halaman-03.webp'])
    expect(fail.map((f) => [f.nama, f.nombor, f.namaAsal, f.jenis])).toEqual([
      ['halaman-01.png', 1, 'Gambar A.png', 'image/png'],
      ['halaman-03.webp', 3, 'Gambar C.webp', 'image/webp'],
    ])
    expect([...fail[0].data]).toEqual([1, 2, 3, 4])
  })

  it('menerima ZIP biasa tanpa konfigurasi dan mengabaikan fail bukan imej', () => {
    const zip = zipSync({
      'imej/halaman-10.jpg': bait(10),
      'imej/halaman-2.jpg': bait(2),
      'nota.txt': strToU8('abc'),
      '__MACOSX/imej/._halaman-2.jpg': bait(0),
    })
    const { fail, konfigurasi } = bacaPakej(zip)
    expect(konfigurasi).toBeNull()
    expect(fail.map((f) => [f.nama, f.nombor, f.jenis])).toEqual([
      ['halaman-2.jpg', null, 'image/jpeg'],
      ['halaman-10.jpg', null, 'image/jpeg'],
    ])
  })
})
