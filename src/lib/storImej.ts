/**
 * Stor imej halaman yang dimuat naik melalui Pengurus Halaman Buku.
 *
 * - Imej disimpan dalam IndexedDB pelayar ini (peranti dan pelayar yang sama
 *   sahaja). Tiada fail dihantar ke pelayan atau ke GitHub.
 * - Jika IndexedDB tidak tersedia atau gagal (contohnya kuota penuh), imej
 *   hanya disimpan dalam memori untuk sesi semasa.
 * - Fail asal disimpan tanpa diubah (tiada pemampatan semula atau pemotongan).
 */
import { useSyncExternalStore } from 'react'

export interface ImejDimuatNaik {
  nombor: number
  /** Nama fail asal. */
  nama: string
  jenis: string
  saiz: number
  lebar: number
  tinggi: number
  dikemaskini: number
  /** URL objek untuk dipaparkan. */
  url: string
  /** Benar jika tersimpan dalam IndexedDB; palsu jika sesi sahaja. */
  tersimpan: boolean
}

/** `memuat`: sedang membaca storan · `pelayar`: IndexedDB berfungsi · `sesi`: memori sahaja. */
export type ModStoran = 'memuat' | 'pelayar' | 'sesi'

export interface KeadaanStor {
  mod: ModStoran
  imej: Readonly<Record<number, ImejDimuatNaik>>
}

interface RekodDb {
  nombor: number
  nama: string
  jenis: string
  saiz: number
  lebar: number
  tinggi: number
  dikemaskini: number
  // ArrayBuffer (bukan Blob) kerana disokong dengan baik oleh semua pelayar, termasuk Safari lama.
  data: ArrayBuffer
}

const NAMA_DB = 'ai-storybook-showcase'
const STOR = 'halaman'

let keadaan: KeadaanStor = { mod: 'memuat', imej: {} }
const pendengar = new Set<() => void>()
let db: IDBDatabase | null = null
let mula: Promise<void> | null = null

function tetapkan(baharu: Partial<KeadaanStor>) {
  keadaan = { ...keadaan, ...baharu }
  for (const p of pendengar) p()
}

function langgan(p: () => void) {
  pendengar.add(p)
  return () => pendengar.delete(p)
}

export function dapatkanKeadaan(): KeadaanStor {
  return keadaan
}

/** Hook React: keadaan stor imej (dikemas kini secara automatik). */
export function useStorImej(): KeadaanStor {
  return useSyncExternalStore(langgan, dapatkanKeadaan, dapatkanKeadaan)
}

/** URL imej yang dimuat naik bagi satu halaman, atau `undefined`. */
export function useImejDimuatNaik(nombor: number): ImejDimuatNaik | undefined {
  return useStorImej().imej[nombor]
}

function mintaDb<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((lulus, gagal) => {
    req.onsuccess = () => lulus(req.result)
    req.onerror = () => gagal(req.error)
  })
}

function bukaDb(): Promise<IDBDatabase> {
  return new Promise((lulus, gagal) => {
    if (typeof indexedDB === 'undefined') return gagal(new Error('IndexedDB tidak tersedia'))
    const req = indexedDB.open(NAMA_DB, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STOR)) req.result.createObjectStore(STOR, { keyPath: 'nombor' })
    }
    req.onsuccess = () => lulus(req.result)
    req.onerror = () => gagal(req.error)
    req.onblocked = () => gagal(new Error('IndexedDB disekat'))
  })
}

function urusniaga<T>(mod: IDBTransactionMode, kerja: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  if (!db) return Promise.reject(new Error('Tiada pangkalan data'))
  const tx = db.transaction(STOR, mod)
  const hasil = mintaDb(kerja(tx.objectStore(STOR)))
  return new Promise((lulus, gagal) => {
    tx.oncomplete = () => void hasil.then(lulus, gagal)
    tx.onerror = () => gagal(tx.error)
    tx.onabort = () => gagal(tx.error ?? new Error('Urus niaga dibatalkan'))
  })
}

/** Nyahkod imej untuk mendapatkan dimensi dan memastikan paparan pertama tanpa kelipan. */
async function nyahkod(url: string): Promise<{ lebar: number; tinggi: number }> {
  const img = new Image()
  img.src = url
  try {
    await img.decode()
  } catch {
    // Sesetengah pelayar gagal decode() untuk imej yang sah; semak dimensi sebagai sandaran.
    if (!img.naturalWidth) await new Promise((l, g) => ((img.onload = l), (img.onerror = g)))
  }
  if (!img.naturalWidth || !img.naturalHeight) throw new Error('Imej tidak dapat dibaca')
  return { lebar: img.naturalWidth, tinggi: img.naturalHeight }
}

/** Baca imej tersimpan daripada IndexedDB. Selamat dipanggil berulang kali. */
export function mulakanStor(): Promise<void> {
  mula ??= (async () => {
    try {
      db = await bukaDb()
      const rekod = await urusniaga('readonly', (s) => s.getAll() as IDBRequest<RekodDb[]>)
      const imej: Record<number, ImejDimuatNaik> = {}
      for (const { data, ...maklumat } of rekod) {
        const url = URL.createObjectURL(new Blob([data], { type: maklumat.jenis }))
        imej[maklumat.nombor] = { ...maklumat, url, tersimpan: true }
      }
      tetapkan({ mod: 'pelayar', imej })
      // Pranyahkod di latar supaya animasi selak tidak berkelip.
      for (const i of Object.values(imej)) void nyahkod(i.url).catch(() => {})
    } catch {
      db = null
      tetapkan({ mod: 'sesi' })
    }
  })()
  return mula
}

/** Lepaskan URL lama selepas seketika, supaya helaian yang sedang diselak tidak kosong. */
function lepaskanKemudian(url: string) {
  window.setTimeout(() => URL.revokeObjectURL(url), 3000)
}

export interface HasilSimpan {
  imej: ImejDimuatNaik
  /** Benar jika IndexedDB gagal dan imej hanya disimpan untuk sesi ini. */
  sesiSahaja: boolean
}

/** Simpan (atau ganti) imej bagi satu halaman. Bait fail asal disimpan tanpa diubah. */
export async function simpanImej(nombor: number, fail: Blob, nama: string, jenis: string): Promise<HasilSimpan> {
  await mulakanStor()
  const data = await fail.arrayBuffer()
  const blob = new Blob([data], { type: jenis })
  const url = URL.createObjectURL(blob)
  let dimensi: { lebar: number; tinggi: number }
  try {
    dimensi = await nyahkod(url)
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
  const rekod: RekodDb = { nombor, nama, jenis, saiz: blob.size, ...dimensi, dikemaskini: Date.now(), data }

  let tersimpan = false
  if (db) {
    try {
      await urusniaga('readwrite', (s) => s.put(rekod))
      tersimpan = true
    } catch {
      tersimpan = false
    }
  }

  const imej: ImejDimuatNaik = {
    nombor,
    nama,
    jenis,
    saiz: rekod.saiz,
    lebar: rekod.lebar,
    tinggi: rekod.tinggi,
    dikemaskini: rekod.dikemaskini,
    url,
    tersimpan,
  }
  const lama = keadaan.imej[nombor]
  tetapkan({ imej: { ...keadaan.imej, [nombor]: imej } })
  if (lama) lepaskanKemudian(lama.url)
  return { imej, sesiSahaja: !tersimpan }
}

/** Buang imej yang dimuat naik bagi satu halaman. */
export async function buangImej(nombor: number): Promise<void> {
  await mulakanStor()
  if (db) await urusniaga('readwrite', (s) => s.delete(nombor)).catch(() => {})
  const lama = keadaan.imej[nombor]
  if (!lama) return
  const imej = { ...keadaan.imej }
  delete imej[nombor]
  tetapkan({ imej })
  lepaskanKemudian(lama.url)
}

/** Buang semua imej yang dimuat naik. */
export async function buangSemuaImej(): Promise<void> {
  await mulakanStor()
  if (db) await urusniaga('readwrite', (s) => s.clear()).catch(() => {})
  const lama = Object.values(keadaan.imej)
  tetapkan({ imej: {} })
  for (const i of lama) lepaskanKemudian(i.url)
}

/** Bait asal imej yang dimuat naik (untuk eksport pakej). */
export async function dataImej(nombor: number): Promise<Uint8Array | null> {
  const i = keadaan.imej[nombor]
  if (!i) return null
  const res = await fetch(i.url)
  return new Uint8Array(await res.arrayBuffer())
}

export interface MaklumatStoran {
  /** `null` jika pelayar tidak menyokong API Storage. */
  kekal: boolean | null
  digunakan: number | null
  kuota: number | null
}

export async function maklumatStoran(): Promise<MaklumatStoran> {
  const s = typeof navigator !== 'undefined' ? navigator.storage : undefined
  const [kekal, anggaran] = await Promise.all([
    s?.persisted ? s.persisted().catch(() => null) : Promise.resolve(null),
    s?.estimate ? s.estimate().catch(() => null) : Promise.resolve(null),
  ])
  return { kekal, digunakan: anggaran?.usage ?? null, kuota: anggaran?.quota ?? null }
}

/**
 * Minta pelayar menandakan storan laman ini sebagai kekal (tidak dibuang
 * secara automatik apabila ruang cakera rendah). Pelayar boleh menolak.
 */
export async function mintaStoranKekal(): Promise<boolean> {
  const s = typeof navigator !== 'undefined' ? navigator.storage : undefined
  if (!s?.persist) return false
  return s.persist().catch(() => false)
}
