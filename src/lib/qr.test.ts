import { describe, expect, it } from 'vitest'
import { janaQR, svgQR } from './qr'

describe('janaQR', () => {
  it('menghasilkan matriks QR sah dengan sempadan senyap 4 modul', () => {
    const url = 'https://contoh.github.io/ai-storybook-showcase/prompt/'
    const qr = janaQR(url)
    // Saiz QR = 17 + 4 × versi, ditambah 2 × 4 modul sempadan.
    expect(qr.saiz).toBe(17 + 4 * qr.versi + 8)
    expect(qr.laluan.startsWith('M')).toBe(true)
    // Penanda kedudukan atas-kiri bermula pada modul (4,4) dengan baris 7 modul gelap.
    expect(qr.laluan).toContain('M4 4h7v1h-7z')
  })

  it('URL berbeza menghasilkan corak berbeza; URL sama adalah deterministik', () => {
    expect(janaQR('https://a.example/x').laluan).toBe(janaQR('https://a.example/x').laluan)
    expect(janaQR('https://a.example/x').laluan).not.toBe(janaQR('https://a.example/y').laluan)
  })

  it('SVG lengkap berlatar putih', () => {
    const svg = svgQR('https://a.example/x', 512)
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/)
    expect(svg).toContain('fill="#fff"')
    expect(svg).toContain('width="512"')
  })
})
