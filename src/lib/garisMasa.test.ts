import { describe, expect, it } from 'vitest'
import { pengurangAutoplay, keadaanAwal } from './autoplay'
import {
  JUMLAH_MS,
  SEGMEN,
  binaSlaid,
  formatMasa,
  kedudukanPadaMasa,
  kemajuanSegmen,
  masaKeseluruhan,
  masaMulaSlaid,
  segmenPadaMasa,
} from './garisMasa'

const slaid = binaSlaid(12)
const mula = masaMulaSlaid(slaid)

describe('garis masa TikTok Cinematic Showcase', () => {
  it('berjumlah tepat 60 saat dengan segmen bersambung', () => {
    expect(JUMLAH_MS).toBe(60_000)
    expect(SEGMEN[0].mulaMs).toBe(0)
    SEGMEN.slice(1).forEach((s, i) => expect(s.mulaMs).toBe(SEGMEN[i].tamatMs))
    expect(slaid.reduce((n, s) => n + s.tempohMs, 0)).toBe(60_000)
  })

  it('mengikut susunan yang ditetapkan', () => {
    expect(SEGMEN.map((s) => [s.jenis, s.mulaMs / 1000, s.tamatMs / 1000])).toEqual([
      ['hook', 0, 5],
      ['kulit', 5, 12],
      ['halaman', 12, 35],
      ['struktur', 35, 45],
      ['aliran', 45, 52],
      ['qr', 52, 60],
    ])
  })

  it('kulit memaparkan halaman 1, kemudian halaman 2 hingga 12 diselak antara 12–35 saat', () => {
    expect(slaid.find((s) => s.segmen === 'kulit')?.indeksBuku).toBe(0)
    const halaman = slaid.filter((s) => s.segmen === 'halaman')
    expect(halaman.map((s) => s.indeksBuku)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    const i = slaid.findIndex((s) => s.segmen === 'halaman')
    expect(mula[i]).toBe(12_000)
    expect(mula[i + halaman.length]).toBe(35_000)
  })

  it('menukar masa kepada kedudukan slaid dan sebaliknya', () => {
    for (const ms of [0, 4_999, 5_000, 11_999, 12_000, 20_500, 34_999, 35_000, 44_999, 45_000, 51_999, 52_000, 59_999]) {
      const k = kedudukanPadaMasa(slaid, ms)
      expect(masaKeseluruhan(mula, k.indeks, k.berlalu)).toBe(ms)
      expect(segmenPadaMasa(ms).jenis).toBe(slaid[k.indeks].segmen)
    }
    expect(kedudukanPadaMasa(slaid, -10)).toEqual({ indeks: 0, berlalu: 0 })
    expect(kedudukanPadaMasa(slaid, 99_999).indeks).toBe(slaid.length - 1)
  })

  it('enjin autoplay tamat tepat selepas 60 saat', () => {
    const config = { jumlah: slaid.length, tempoh: (i: number) => slaid[i].tempohMs }
    let k = pengurangAutoplay(keadaanAwal, { jenis: 'mula' }, config)
    for (let t = 0; t < 59_900; t += 100) k = pengurangAutoplay(k, { jenis: 'detik', dt: 100 }, config)
    expect(k.tamat).toBe(false)
    expect(segmenPadaMasa(masaKeseluruhan(mula, k.indeks, k.berlalu)).jenis).toBe('qr')
    k = pengurangAutoplay(k, { jenis: 'detik', dt: 200 }, config)
    expect(k).toMatchObject({ tamat: true, bermain: false, indeks: slaid.length - 1 })
  })

  it('kemajuan segmen dan format masa', () => {
    expect(kemajuanSegmen(SEGMEN[2], 23_500)).toBeCloseTo(0.5)
    expect(kemajuanSegmen(SEGMEN[2], 0)).toBe(0)
    expect(kemajuanSegmen(SEGMEN[2], 60_000)).toBe(1)
    expect(formatMasa(0)).toBe('0:00')
    expect(formatMasa(35_400)).toBe('0:35')
    expect(formatMasa(60_000)).toBe('1:00')
  })
})
