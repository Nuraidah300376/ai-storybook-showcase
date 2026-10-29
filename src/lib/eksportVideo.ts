/**
 * Klien API eksport video MP4 (Fasa 4). API hanya wujud apabila aplikasi
 * dijalankan melalui pelayan tempatan (`npm run eksport:pelayan`, `npm run dev`
 * atau `npm run preview`) — lihat scripts/pluginEksportVideo.ts. Pada laman
 * statik, fail pratonton atau Claude Artifact, `semakPelayan` memulangkan null.
 */
import type { ImejMuatan, MuatanEksport } from '../components/tiktok/PentasEksport'
import { dapatkanKodQrTersuai } from './kodQrTersuai'
import { dapatkanKeadaan, dataImej } from './storImej'

const API = '/api/eksport-video'

/** Pautan aliran kerja GitHub Actions yang menghasilkan MP4 sebagai artifak. */
export const URL_ALIRAN_KERJA =
  'https://github.com/Nuraidah300376/ai-storybook-showcase/actions/workflows/eksport-video-tiktok.yml'

export type KeadaanTugas = 'berjalan' | 'berjaya' | 'gagal' | 'dibatalkan'

export interface Semakan {
  nama: string
  lulus: boolean
  butiran: string
}

export interface TugasEksport {
  id: string
  keadaan: KeadaanTugas
  fasa: string
  bingkai: number
  jumlah: number
  dimulakan: number
  tamat?: number
  mesej?: string
  namaFail?: string
  saizBait?: number
  semakan?: Semakan[]
}

export interface StatusPelayan {
  tersedia: true
  ffmpeg: boolean
  tugas: TugasEksport | null
}

async function ambilJson<T>(url: string, init?: RequestInit, hadMs = 4000): Promise<T> {
  const kawalan = new AbortController()
  const t = window.setTimeout(() => kawalan.abort(), hadMs)
  try {
    const res = await fetch(url, { ...init, signal: kawalan.signal, cache: 'no-store' })
    const jenis = res.headers.get('content-type') ?? ''
    if (!jenis.includes('application/json')) throw new Error(`Respons bukan JSON (${res.status}).`)
    const data = (await res.json()) as T & { mesej?: string }
    if (!res.ok) throw new Error(data.mesej ?? `Ralat pelayan (${res.status}).`)
    return data
  } finally {
    window.clearTimeout(t)
  }
}

/** Semak sama ada enjin eksport tempatan tersedia. `null` = tiada (laman statik / Artifact / file://). */
export async function semakPelayan(): Promise<StatusPelayan | null> {
  if (!/^https?:$/.test(window.location.protocol)) return null
  try {
    const s = await ambilJson<StatusPelayan>(API, undefined, 2500)
    return s?.tersedia === true ? s : null
  } catch {
    return null
  }
}

function keBase64(bait: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bait.length; i += 0x8000) s += String.fromCharCode(...bait.subarray(i, i + 0x8000))
  return btoa(s)
}

/** Imej yang dimuat naik (IndexedDB pelayar ini) dan kod QR tersuai, supaya video sama seperti paparan. */
export async function binaMuatan(): Promise<MuatanEksport> {
  const imej: ImejMuatan[] = []
  for (const i of Object.values(dapatkanKeadaan().imej)) {
    const data = await dataImej(i.nombor)
    if (data) imej.push({ nombor: i.nombor, nama: i.nama, jenis: i.jenis, base64: keBase64(data) })
  }
  return { kodQr: dapatkanKodQrTersuai(), imej }
}

export async function mulaEksport(muatan: MuatanEksport): Promise<TugasEksport> {
  return ambilJson<TugasEksport>(
    API,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(muatan) },
    60_000,
  )
}

export function statusTugas(id: string): Promise<TugasEksport> {
  return ambilJson<TugasEksport>(`${API}/tugas/${id}`)
}

export function batalTugas(id: string): Promise<TugasEksport> {
  return ambilJson<TugasEksport>(`${API}/tugas/${id}/batal`, { method: 'POST' })
}

export function urlFail(id: string): string {
  return `${API}/tugas/${id}/fail`
}
