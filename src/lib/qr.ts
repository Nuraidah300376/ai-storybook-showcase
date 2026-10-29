import { encode } from 'uqr'

export interface MatriksQR {
  /** Bilangan modul pada setiap sisi (termasuk sempadan senyap). */
  saiz: number
  versi: number
  /** Laluan SVG bagi semua modul gelap, dalam unit modul. */
  laluan: string
}

/**
 * Jana matriks kod QR (pembetulan ralat M, sempadan senyap 4 modul seperti
 * piawaian) sebagai satu laluan SVG. Dijana sepenuhnya dalam pelayar.
 */
export function janaQR(teks: string): MatriksQR {
  const qr = encode(teks, { ecc: 'M', border: 4 })
  let laluan = ''
  qr.data.forEach((baris, y) => {
    let x = 0
    while (x < baris.length) {
      if (!baris[x]) {
        x++
        continue
      }
      // Gabungkan modul gelap bersebelahan dalam satu baris untuk laluan yang lebih ringkas.
      let akhir = x
      while (akhir < baris.length && baris[akhir]) akhir++
      laluan += `M${x} ${y}h${akhir - x}v1h${x - akhir}z`
      x = akhir
    }
  })
  return { saiz: qr.size, versi: qr.version, laluan }
}

/** Dokumen SVG lengkap (latar putih) untuk dimuat turun atau dicetak. */
export function svgQR(teks: string, piksel = 1024): string {
  const { saiz, laluan } = janaQR(teks)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${saiz} ${saiz}" width="${piksel}" height="${piksel}" shape-rendering="crispEdges"><rect width="${saiz}" height="${saiz}" fill="#fff"/><path d="${laluan}" fill="#000"/></svg>`
}
