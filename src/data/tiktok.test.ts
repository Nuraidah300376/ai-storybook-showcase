import { describe, expect, it } from 'vitest'
import { MASTER_PROMPT } from './masterPrompt'
import {
  ADEGAN,
  BAHAGIAN,
  JUMLAH_BINGKAI,
  JUMLAH_MS,
  KELEBIHAN,
  LANGKAH,
  MULA_MS,
  SPESIFIKASI_VIDEO,
  indeksAdeganPadaMasa,
  indeksBahagian,
} from './tiktok'

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

describe('eksport video MP4', () => {
  it('menyasarkan 1080×1920 (9:16), 30 fps, tepat 60 saat = 1800 bingkai', () => {
    expect(SPESIFIKASI_VIDEO.lebar / SPESIFIKASI_VIDEO.tinggi).toBe(9 / 16)
    expect(SPESIFIKASI_VIDEO.fps).toBe(30)
    expect(SPESIFIKASI_VIDEO.tempohMs).toBe(60_000)
    expect(JUMLAH_BINGKAI).toBe(1800)
  })

  it('memetakan setiap masa kepada adegan yang betul', () => {
    expect(indeksAdeganPadaMasa(0)).toBe(0)
    expect(indeksAdeganPadaMasa(-5)).toBe(0)
    for (let i = 0; i < ADEGAN.length; i++) {
      expect(indeksAdeganPadaMasa(MULA_MS[i])).toBe(i)
      expect(indeksAdeganPadaMasa(MULA_MS[i] + ADEGAN[i].tempohMs - 1)).toBe(i)
    }
    expect(indeksAdeganPadaMasa(JUMLAH_MS)).toBe(ADEGAN.length - 1)
    // Bingkai terakhir (59.967 s) berada dalam adegan kod QR.
    expect(ADEGAN[indeksAdeganPadaMasa(((JUMLAH_BINGKAI - 1) * 1000) / 30)].jenis).toBe('qr')
  })
})
