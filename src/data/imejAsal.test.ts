import { describe, expect, it } from 'vitest'
import { HALAMAN, namaFailImej } from './buku'

// Fail dalam public/halaman/ sebagai data URL base64 (dibaca oleh Vite semasa ujian).
const imej = import.meta.glob<string>('../../public/halaman/*.{png,webp,jpg,jpeg}', {
  query: '?inline',
  import: 'default',
  eager: true,
})

const namaFail = (laluan: string) => laluan.split('/').pop()!

function bait(dataUrl: string): Uint8Array {
  const b64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

describe('imej asal dalam public/halaman', () => {
  it('mengandungi tepat halaman-01.png hingga halaman-12.png', () => {
    expect(Object.keys(imej).map(namaFail).sort()).toEqual(HALAMAN.map((h) => `${namaFailImej(h.nombor)}.png`))
  })

  it('setiap fail ialah PNG sah berorientasi potret', () => {
    for (const [laluan, url] of Object.entries(imej)) {
      const b = bait(url)
      expect([...b.subarray(0, 8)], namaFail(laluan)).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      const v = new DataView(b.buffer)
      expect(v.getUint32(20), namaFail(laluan)).toBeGreaterThan(v.getUint32(16))
    }
  })
})
