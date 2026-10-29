import jsQR from 'jsqr'
import { describe, expect, it } from 'vitest'
import { URL_PROMPT } from '../data/masterPrompt'
import { janaMatriksQr, laluanSvgQr, type MatriksQr } from './kodQr'

/** Lukis matriks kepada piksel RGBA (hitam/putih) dengan zon senyap. */
function rasterkan(m: MatriksQr, skala = 6, zon = 4) {
  const n = (m.saiz + zon * 2) * skala
  const data = new Uint8ClampedArray(n * n * 4).fill(255)
  for (let y = 0; y < m.saiz; y++)
    for (let x = 0; x < m.saiz; x++) {
      if (!m.modul[y * m.saiz + x]) continue
      for (let dy = 0; dy < skala; dy++)
        for (let dx = 0; dx < skala; dx++) {
          const i = (((y + zon) * skala + dy) * n + (x + zon) * skala + dx) * 4
          data[i] = data[i + 1] = data[i + 2] = 0
        }
    }
  return { data, n }
}

describe('kod QR master prompt', () => {
  const m = janaMatriksQr(URL_PROMPT)

  it('boleh diimbas dan menghala ke pautan GitHub master prompt', () => {
    const { data, n } = rasterkan(m)
    expect(jsQR(data, n, n)?.data).toBe(URL_PROMPT)
  })

  it('cukup kecil untuk modul besar pada skrin telefon', () => {
    expect(m.versi).toBeLessThanOrEqual(7)
    expect(m.modul).toHaveLength(m.saiz * m.saiz)
  })

  it('menghasilkan satu laluan SVG bagi setiap modul gelap', () => {
    const gelap = m.modul.filter(Boolean).length
    expect(laluanSvgQr(m).match(/M/g)).toHaveLength(gelap)
  })
})
