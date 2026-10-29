import { describe, expect, it } from 'vitest'
import { agihkanFail, bukanA5, failDisokong, formatSaiz, nomborDaripadaNama } from './susunFail'

const f = (...nama: string[]) => nama.map((n) => ({ nama: n }))

describe('failDisokong', () => {
  it('menerima PNG, JPG, JPEG dan WebP sahaja', () => {
    for (const n of ['a.png', 'a.JPG', 'a.jpeg', 'a.webp']) expect(failDisokong(n)).toBe(true)
    for (const n of ['a.gif', 'a.pdf', 'a.svg', 'png']) expect(failDisokong(n)).toBe(false)
    expect(failDisokong('tanpa-sambungan', 'image/webp')).toBe(true)
  })
})

describe('nomborDaripadaNama', () => {
  it('membaca nombor halaman daripada pelbagai gaya nama', () => {
    expect(nomborDaripadaNama('halaman-01.png', 12)).toBe(1)
    expect(nomborDaripadaNama('Halaman 12.jpg', 12)).toBe(12)
    expect(nomborDaripadaNama('7.webp', 12)).toBe(7)
    expect(nomborDaripadaNama('folder/hal_03.jpeg', 12)).toBe(3)
  })

  it('mengutamakan nombor selepas kata kunci', () => {
    expect(nomborDaripadaNama('page_12_final_v2.png', 12)).toBe(12)
    expect(nomborDaripadaNama('v3 halaman 5.png', 12)).toBe(5)
  })

  it('mengabaikan nombor di luar julat seperti tahun', () => {
    expect(nomborDaripadaNama('Amanah 2024 - 03.png', 12)).toBe(3)
    expect(nomborDaripadaNama('halaman-13.png', 12)).toBeNull()
    expect(nomborDaripadaNama('kulit.png', 12)).toBeNull()
  })
})

describe('agihkanFail', () => {
  it('menyusun 12 fail yang dipilih secara rawak mengikut nombor nama fail', () => {
    const nama = Array.from({ length: 12 }, (_, i) => `halaman-${String(i + 1).padStart(2, '0')}.png`)
    const rawak = [...nama].reverse()
    const { tugasan, diabaikan } = agihkanFail(f(...rawak), 12)
    expect(diabaikan).toEqual([])
    expect(tugasan.map((t) => [t.nombor, rawak[t.fail]])).toEqual(nama.map((n, i) => [i + 1, n]))
  })

  it('menyusun halaman-2 sebelum halaman-10 (bukan susunan abjad)', () => {
    const { tugasan } = agihkanFail(f('halaman-10.png', 'halaman-2.png', 'halaman-1.png'), 12)
    expect(tugasan.map((t) => t.nombor)).toEqual([1, 2, 10])
  })

  it('mengisi slot kosong untuk fail tanpa nombor, ikut susunan nama', () => {
    const { tugasan } = agihkanFail(f('zebra.png', 'halaman-01.png', 'anak.png'), 12, new Set([2]))
    expect(tugasan).toEqual([
      { fail: 1, nombor: 1, sebab: 'nombor-nama' },
      { fail: 2, nombor: 3, sebab: 'slot-kosong' },
      { fail: 0, nombor: 4, sebab: 'slot-kosong' },
    ])
  })

  it('mengabaikan format tidak disokong dan nombor pendua', () => {
    const { tugasan, diabaikan } = agihkanFail(f('halaman-01.png', 'halaman-1.jpg', 'nota.pdf'), 12)
    expect(tugasan).toEqual([{ fail: 0, nombor: 1, sebab: 'nombor-nama' }])
    expect(diabaikan).toEqual([
      { fail: 1, sebab: 'pendua' },
      { fail: 2, sebab: 'format' },
    ])
  })

  it('melaporkan fail tanpa nombor apabila semua slot penuh', () => {
    const penuh = new Set(Array.from({ length: 12 }, (_, i) => i + 1))
    const { tugasan, diabaikan } = agihkanFail(f('lain.png'), 12, penuh)
    expect(tugasan).toEqual([])
    expect(diabaikan).toEqual([{ fail: 0, sebab: 'tiada-slot' }])
  })
})

describe('bantuan', () => {
  it('mengesan imej bukan A5 potret', () => {
    expect(bukanA5(1748, 2480)).toBe(false)
    expect(bukanA5(1240, 1754)).toBe(false)
    expect(bukanA5(1600, 1200)).toBe(true)
  })

  it('memformat saiz fail', () => {
    expect(formatSaiz(512)).toBe('512 B')
    expect(formatSaiz(2048)).toBe('2 KB')
    expect(formatSaiz(1.5 * 1024 * 1024)).toBe('1,5 MB')
  })
})
