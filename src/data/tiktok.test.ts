import { describe, expect, it } from 'vitest'
import { MASTER_PROMPT } from './masterPrompt'
import { ADEGAN, BAHAGIAN, JUMLAH_MS, KELEBIHAN, LANGKAH, MULA_MS, indeksBahagian } from './tiktok'

const mulaBahagian = (j: Parameters<typeof indeksBahagian>[0]) => MULA_MS[indeksBahagian(j)]

describe('garis masa TikTok', () => {
  it('berjumlah tepat 60 saat', () => {
    expect(JUMLAH_MS).toBe(60_000)
  })

  it('mengikut susunan 0–5–12–35–45–52–60 s', () => {
    expect(BAHAGIAN).toEqual(['hook', 'kulit', 'halaman', 'kelebihan', 'proses', 'qr'])
    expect(mulaBahagian('hook')).toBe(0)
    expect(mulaBahagian('kulit')).toBe(5_000)
    expect(mulaBahagian('halaman')).toBe(12_000)
    expect(mulaBahagian('kelebihan')).toBe(35_000)
    expect(mulaBahagian('proses')).toBe(45_000)
    expect(mulaBahagian('qr')).toBe(52_000)
  })

  it('memaparkan kesemua 12 halaman mengikut urutan', () => {
    const halaman = ADEGAN.filter((a) => a.jenis === 'halaman')
    expect(halaman.map((a) => a.halaman)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(halaman.every((a) => a.tempohMs >= 1_500)).toBe(true)
  })

  it('setiap adegan mempunyai kapsyen ringkas', () => {
    for (const a of ADEGAN) {
      expect(a.kapsyen.length).toBeGreaterThan(0)
      expect(a.kapsyen.length).toBeLessThanOrEqual(56)
    }
  })

  it('kelebihan dan langkah berdasarkan master prompt asal', () => {
    for (const { bukti } of [...KELEBIHAN, ...LANGKAH]) expect(MASTER_PROMPT).toContain(bukti)
    expect(LANGKAH.map((l) => l.tajuk)).toEqual(['RANCANG', 'LULUS', 'JANA SATU HALAMAN'])
  })
})
