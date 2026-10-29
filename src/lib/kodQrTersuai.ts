/**
 * Kod QR gantian yang dimuat naik pengguna (PNG/JPG/WebP) untuk adegan
 * terakhir persembahan TikTok. Imej disahkan dengan pembaca QR sebelum
 * diterima, supaya hanya kod yang benar-benar boleh diimbas dipaparkan.
 * Disimpan dalam localStorage pelayar ini sahaja.
 */
import { useSyncExternalStore } from 'react'

export interface KodQrTersuai {
  /** Imej asal sebagai data URL. */
  dataUrl: string
  /** Teks yang dibaca daripada kod QR. */
  teks: string
  nama: string
}

const KUNCI = 'ai-storybook-showcase:kod-qr'
const pendengar = new Set<() => void>()
let semasa: KodQrTersuai | null = baca()

function baca(): KodQrTersuai | null {
  try {
    const s = localStorage.getItem(KUNCI)
    return s ? (JSON.parse(s) as KodQrTersuai) : null
  } catch {
    return null
  }
}

function tetapkan(k: KodQrTersuai | null) {
  semasa = k
  try {
    if (k) localStorage.setItem(KUNCI, JSON.stringify(k))
    else localStorage.removeItem(KUNCI)
  } catch {
    // Storan tidak tersedia (mod peribadi): kekal untuk sesi ini sahaja.
  }
  for (const p of pendengar) p()
}

export function useKodQrTersuai(): KodQrTersuai | null {
  return useSyncExternalStore(
    (p) => {
      pendengar.add(p)
      return () => pendengar.delete(p)
    },
    () => semasa,
    () => null,
  )
}

export function buangKodQrTersuai() {
  tetapkan(null)
}

function bacaDataUrl(fail: Blob): Promise<string> {
  return new Promise((lulus, gagal) => {
    const r = new FileReader()
    r.onload = () => lulus(String(r.result))
    r.onerror = () => gagal(r.error)
    r.readAsDataURL(fail)
  })
}

function muatImej(src: string): Promise<HTMLImageElement> {
  return new Promise((lulus, gagal) => {
    const img = new Image()
    img.onload = () => lulus(img)
    img.onerror = () => gagal(new Error('Imej tidak dapat dibuka.'))
    img.src = src
  })
}

/** Baca kod QR daripada imej. Mengembalikan teksnya, atau `null` jika tiada kod QR dikesan. */
async function imbasImej(img: HTMLImageElement): Promise<string | null> {
  const { default: jsQR } = await import('jsqr')
  // Kecilkan imej besar supaya imbasan pantas; kod QR kekal boleh dibaca.
  const skala = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * skala))
  const h = Math.max(1, Math.round(img.naturalHeight * skala))
  const kanvas = document.createElement('canvas')
  kanvas.width = w
  kanvas.height = h
  const ctx = kanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  return jsQR(data, w, h, { inversionAttempts: 'attemptBoth' })?.data ?? null
}

export type HasilMuatNaikQr = { ok: true; kod: KodQrTersuai } | { ok: false; mesej: string }

export async function muatNaikKodQr(fail: File): Promise<HasilMuatNaikQr> {
  if (!/^image\/(png|jpeg|webp)$/.test(fail.type)) return { ok: false, mesej: 'Gunakan fail PNG, JPG atau WebP.' }
  if (fail.size > 3 * 1024 * 1024) return { ok: false, mesej: 'Fail terlalu besar (had 3 MB).' }
  try {
    const dataUrl = await bacaDataUrl(fail)
    const teks = await imbasImej(await muatImej(dataUrl))
    if (!teks) return { ok: false, mesej: 'Tiada kod QR yang boleh dibaca dalam imej ini. Kod sedia ada dikekalkan.' }
    const kod = { dataUrl, teks, nama: fail.name }
    tetapkan(kod)
    return { ok: true, kod }
  } catch {
    return { ok: false, mesej: 'Imej tidak dapat dibaca. Cuba fail lain.' }
  }
}
