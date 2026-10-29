import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { URL_PROMPT } from '../../data/masterPrompt'
import { ADEGAN, JUMLAH_BINGKAI, JUMLAH_MS, MULA_MS, SPESIFIKASI_VIDEO, TEMPOH_SELAK_MS, indeksAdeganPadaMasa } from '../../data/tiktok'
import { tetapkanKodQrTersuai, useKodQrTersuai, type KodQrTersuai } from '../../lib/kodQrTersuai'
import { dapatkanKeadaan, mulakanStor, simpanImej } from '../../lib/storImej'
import { pramuatImej, urlImejAsal } from '../ImejHalaman'
import { PentasTikTok } from './PentasTikTok'

/**
 * Laluan halaman pemaparan video (Fasa 4). Dibuka oleh skrip
 * `scripts/eksport-video.mjs` dalam Chromium tanpa kepala: pentas 1080×1920
 * dipaparkan pada skala 1, tanpa kawalan, kursor atau bar skrol.
 */
export const LALUAN_RENDER = '#render-tiktok'

/** Imej halaman yang dimuat naik pengguna, dihantar bersama permintaan eksport. */
export interface ImejMuatan {
  nombor: number
  nama: string
  jenis: string
  /** Bait fail asal dalam base64. */
  base64: string
}

export interface MuatanEksport {
  kodQr: KodQrTersuai | null
  imej: ImejMuatan[]
}

export interface MaklumatSedia {
  imejDimuatNaik: number
  imejAsal: number
  teksQr: string
}

/** Selakan halaman dalam garis masa (untuk menyemak animasi dalam MP4 akhir). */
export const PERISTIWA_SELAK = ADEGAN.flatMap((a, i) =>
  a.jenis === 'halaman' && (a.halaman ?? 0) > 0 ? [{ halaman: (a.halaman ?? 0) + 1, mulaMs: MULA_MS[i], tempohMs: TEMPOH_SELAK_MS }] : [],
)

/** Antara muka yang dipanggil oleh skrip pemapar melalui `page.evaluate`. */
export interface AntaraMukaEksport {
  spesifikasi: typeof SPESIFIKASI_VIDEO & { jumlahBingkai: number; peristiwaSelak: typeof PERISTIWA_SELAK }
  sediakan(muatan: MuatanEksport): Promise<MaklumatSedia>
  /** Mulakan garis masa pada masa semasa (jam maya). */
  mula(): void
}

declare global {
  interface Window {
    __eksportTikTok?: AntaraMukaEksport
  }
}

const FON = [
  '500 40px Fraunces',
  '700 40px Fraunces',
  'italic 500 40px Fraunces',
  '400 40px "Plus Jakarta Sans"',
  '600 40px "Plus Jakarta Sans"',
  '700 40px "Plus Jakarta Sans"',
]

function base64KeBait(b64: string): Uint8Array<ArrayBuffer> {
  const s = atob(b64)
  const bait = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) bait[i] = s.charCodeAt(i)
  return bait
}

/** Rujukan imej yang sudah dinyahkod, supaya pelayar tidak membuangnya semasa pemaparan. */
const dinyahkod: HTMLImageElement[] = []

async function nyahkodSemua(url: string[]) {
  await Promise.all(
    url.map((u) => {
      const img = new Image()
      img.src = u
      dinyahkod.push(img)
      return img.decode().catch(() => {})
    }),
  )
}

export function PentasEksport() {
  const [sedia, setSedia] = useState(false)
  const [mulaMs, setMulaMs] = useState<number | null>(null)
  const [masa, setMasa] = useState(0)
  const kodQr = useKodQrTersuai()

  useEffect(() => {
    const gaya = document.documentElement.style
    gaya.overflow = 'hidden'
    gaya.cursor = 'none'
    document.body.style.margin = '0'
    document.body.style.background = '#070d1f'

    window.__eksportTikTok = {
      spesifikasi: { ...SPESIFIKASI_VIDEO, jumlahBingkai: JUMLAH_BINGKAI, peristiwaSelak: PERISTIWA_SELAK },
      async sediakan(muatan) {
        await mulakanStor()
        for (const i of muatan.imej) {
          await simpanImej(i.nombor, new Blob([base64KeBait(i.base64)], { type: i.jenis }), i.nama, i.jenis)
        }
        tetapkanKodQrTersuai(muatan.kodQr)
        await pramuatImej()
        await Promise.all(FON.map((f) => document.fonts.load(f).catch(() => [])))
        await document.fonts.ready
        const dimuatNaik = Object.values(dapatkanKeadaan().imej).map((i) => i.url)
        await nyahkodSemua([...dimuatNaik, ...urlImejAsal()])
        setSedia(true)
        return {
          imejDimuatNaik: dimuatNaik.length,
          imejAsal: urlImejAsal().length,
          teksQr: muatan.kodQr?.teks ?? URL_PROMPT,
        }
      },
      mula() {
        const t0 = performance.now()
        flushSync(() => {
          setMasa(0)
          setMulaMs(t0)
        })
      },
    }
    return () => {
      delete window.__eksportTikTok
    }
  }, [])

  // Masa garis masa diterbitkan terus daripada jam (dikawal skrip pemapar),
  // jadi setiap bingkai mewakili masa yang tepat.
  useEffect(() => {
    if (mulaMs === null) return
    let raf = 0
    const detik = () => {
      flushSync(() => setMasa(Math.min(JUMLAH_MS, Math.max(0, performance.now() - mulaMs))))
      raf = requestAnimationFrame(detik)
    }
    raf = requestAnimationFrame(detik)
    return () => cancelAnimationFrame(raf)
  }, [mulaMs])

  return (
    <div
      data-pentas-eksport
      data-sedia={sedia}
      data-masa={Math.round(masa)}
      style={{ width: SPESIFIKASI_VIDEO.lebar, height: SPESIFIKASI_VIDEO.tinggi }}
      className="relative overflow-hidden"
    >
      <PentasTikTok
        indeks={indeksAdeganPadaMasa(masa)}
        masa={masa}
        sesi={0}
        dimulakan={mulaMs !== null}
        petunjukMula={false}
        panduanSelamat={false}
        kodQr={kodQr}
      />
    </div>
  )
}
