import { describe, expect, it } from 'vitest'
import { keadaanAwal, kemajuanSlaid, pengurangAutoplay, type ConfigAutoplay } from './autoplay'

const config: ConfigAutoplay = { jumlah: 3, tempoh: () => 1000 }
const run = (k = keadaanAwal, ...t: Parameters<typeof pengurangAutoplay>[1][]) =>
  t.reduce((s, a) => pengurangAutoplay(s, a, config), k)

describe('pengurangAutoplay', () => {
  it('tidak bergerak semasa dijeda', () => {
    expect(run(keadaanAwal, { jenis: 'detik', dt: 5000 })).toEqual(keadaanAwal)
  })

  it('mara ke slaid seterusnya selepas tempoh tamat', () => {
    const k = run(keadaanAwal, { jenis: 'mula' }, { jenis: 'detik', dt: 1200 })
    expect(k.indeks).toBe(1)
    expect(k.berlalu).toBe(200)
  })

  it('berhenti dan tandakan tamat pada slaid terakhir', () => {
    const k = run(keadaanAwal, { jenis: 'mula' }, { jenis: 'detik', dt: 10_000 })
    expect(k).toMatchObject({ indeks: 2, bermain: false, tamat: true })
    expect(kemajuanSlaid(k, config)).toBe(1)
  })

  it('Jeda mengekalkan kedudukan, Mula menyambung', () => {
    const k = run(keadaanAwal, { jenis: 'mula' }, { jenis: 'detik', dt: 500 }, { jenis: 'jeda' }, { jenis: 'detik', dt: 900 })
    expect(k).toMatchObject({ indeks: 0, berlalu: 500, bermain: false })
    expect(run(k, { jenis: 'mula' }).bermain).toBe(true)
  })

  it('Ulang kembali ke awal dan terus bermain', () => {
    const k = run(keadaanAwal, { jenis: 'mula' }, { jenis: 'detik', dt: 1500 }, { jenis: 'ulang' })
    expect(k).toEqual({ ...keadaanAwal, bermain: true, sesi: 1 })
  })

  it('Mula selepas tamat bermula semula dari awal', () => {
    const k = run(keadaanAwal, { jenis: 'mula' }, { jenis: 'detik', dt: 10_000 }, { jenis: 'mula' })
    expect(k).toMatchObject({ indeks: 0, bermain: true, tamat: false, sesi: 1 })
  })

  it('navigasi manual dihadkan dalam julat', () => {
    expect(run(keadaanAwal, { jenis: 'sebelumnya' }).indeks).toBe(0)
    expect(run(keadaanAwal, { jenis: 'pergi', indeks: 99 }).indeks).toBe(2)
  })
})
