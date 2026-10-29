import { create } from 'qrcode'

/**
 * Kod QR sebenar yang dijana daripada teks (pustaka `qrcode`), dalam bentuk
 * matriks modul. Dilukis sebagai SVG supaya tajam pada sebarang saiz.
 */
export interface MatriksQr {
  saiz: number
  versi: number
  /** Benar = modul gelap. Indeks baris * saiz + lajur. */
  modul: boolean[]
}

export function janaMatriksQr(teks: string): MatriksQr {
  // Aras M: muat dalam versi rendah (modul lebih besar, lebih mudah diimbas dari skrin).
  const qr = create(teks, { errorCorrectionLevel: 'M' })
  const saiz = qr.modules.size
  return { saiz, versi: qr.version, modul: Array.from(qr.modules.data, (d) => d === 1) }
}

/** Laluan SVG (satu `d`) bagi semua modul gelap; koordinat dalam unit modul, dengan zon senyap. */
export function laluanSvgQr(m: MatriksQr, zonSenyap = 4): string {
  let d = ''
  for (let y = 0; y < m.saiz; y++) {
    for (let x = 0; x < m.saiz; x++) {
      if (m.modul[y * m.saiz + x]) d += `M${x + zonSenyap} ${y + zonSenyap}h1v1h-1z`
    }
  }
  return d
}
