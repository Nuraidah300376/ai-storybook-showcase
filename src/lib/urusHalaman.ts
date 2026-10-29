/**
 * Tindakan Pengurus Halaman Buku: muat naik, import dan eksport pakej.
 * Setiap tindakan memulangkan senarai mesej untuk dipaparkan kepada pengguna.
 */
import { BUKU, HALAMAN, JUMLAH_HALAMAN, calonImej } from '../data/buku'
import { bacaPakej, binaPakej, type RekodPakej } from './pakej'
import { dapatkanKeadaan, dataImej, simpanImej } from './storImej'
import {
  SAIZ_MAKS_MB,
  agihkanFail,
  bukanA5,
  failDisokong,
  formatSaiz,
  jenisDaripadaNama,
  sambunganFail,
} from './susunFail'

export interface Mesej {
  jenis: 'berjaya' | 'amaran' | 'ralat'
  teks: string
}

export interface FailMasuk {
  nama: string
  jenis: string
  blob: Blob
}

const label = (nombor: number) => HALAMAN[nombor - 1].label

const SEBAB_ABAI = {
  format: 'format tidak disokong (gunakan PNG, JPG, JPEG atau WebP)',
  pendua: 'nombor halaman yang sama sudah digunakan oleh fail lain',
  'tiada-slot': 'tiada nombor halaman dalam nama fail dan semua slot sudah berisi',
} as const

/** Simpan satu fail ke slot tertentu dan kumpul mesej. */
async function simpanSatu(f: FailMasuk, nombor: number, mesej: Mesej[]): Promise<boolean> {
  if (!failDisokong(f.nama, f.jenis)) {
    mesej.push({ jenis: 'ralat', teks: `${f.nama}: ${SEBAB_ABAI.format}.` })
    return false
  }
  if (f.blob.size > SAIZ_MAKS_MB * 1024 * 1024) {
    mesej.push({ jenis: 'ralat', teks: `${f.nama}: saiz ${formatSaiz(f.blob.size)} melebihi had ${SAIZ_MAKS_MB} MB.` })
    return false
  }
  try {
    const jenis = f.jenis || jenisDaripadaNama(f.nama)
    const { imej, sesiSahaja } = await simpanImej(nombor, f.blob, f.nama, jenis)
    mesej.push({ jenis: 'berjaya', teks: `${f.nama} → ${label(nombor)}` })
    if (bukanA5(imej.lebar, imej.tinggi)) {
      mesej.push({
        jenis: 'amaran',
        teks: `${label(nombor)}: saiz ${imej.lebar}×${imej.tinggi} piksel bukan nisbah A5 potret. Imej tetap dipaparkan penuh tanpa dipotong, tetapi ruang kosong mungkin kelihatan di tepi.`,
      })
    }
    if (sesiSahaja) {
      mesej.push({
        jenis: 'amaran',
        teks: `${label(nombor)} disimpan untuk sesi ini sahaja kerana storan pelayar gagal (mungkin penuh atau disekat).`,
      })
    }
    return true
  } catch {
    mesej.push({ jenis: 'ralat', teks: `${f.nama}: fail tidak dapat dibaca sebagai imej.` })
    return false
  }
}

/** Slot yang sudah mempunyai imej (dimuat naik atau fail public/halaman). */
export type SlotBerisi = ReadonlySet<number>

/**
 * Muat naik satu atau lebih fail. Dengan `slot`, fail pertama terus ke slot itu
 * (Muat Naik / Ganti Gambar). Tanpa `slot`, fail disusun mengikut nombor nama fail.
 */
export async function muatNaikFail(fail: FailMasuk[], berisi: SlotBerisi, slot?: number): Promise<Mesej[]> {
  const mesej: Mesej[] = []
  if (slot !== undefined) {
    if (fail[0]) await simpanSatu(fail[0], slot, mesej)
    return mesej
  }

  const zip = fail.filter((f) => sambunganFail(f.nama) === 'zip')
  const imej = fail.filter((f) => sambunganFail(f.nama) !== 'zip')
  for (const z of zip) mesej.push(...(await importPakej(z.blob, z.nama, berisi)))
  if (!imej.length) return mesej

  const { tugasan, diabaikan } = agihkanFail(imej, JUMLAH_HALAMAN, berisi)
  let berjaya = 0
  for (const t of tugasan) if (await simpanSatu(imej[t.fail], t.nombor, mesej)) berjaya++
  for (const d of diabaikan) mesej.push({ jenis: 'ralat', teks: `${imej[d.fail].nama} diabaikan: ${SEBAB_ABAI[d.sebab]}.` })
  const tanpaNombor = tugasan.filter((t) => t.sebab === 'slot-kosong').length
  if (tanpaNombor) {
    mesej.push({
      jenis: 'amaran',
      teks: `${tanpaNombor} fail tiada nombor halaman dalam nama fail, jadi diletakkan ke slot kosong mengikut susunan nama. Semak susunannya.`,
    })
  }
  if (imej.length > 1) mesej.unshift({ jenis: 'berjaya', teks: `${berjaya} daripada ${imej.length} fail disimpan dan disusun mengikut nombor nama fail.` })
  return mesej
}

/** Import pakej ZIP (dieksport oleh aplikasi ini atau ZIP biasa berisi imej). */
export async function importPakej(zip: Blob, nama: string, berisi: SlotBerisi): Promise<Mesej[]> {
  let hasil: ReturnType<typeof bacaPakej>
  try {
    hasil = bacaPakej(new Uint8Array(await zip.arrayBuffer()))
  } catch {
    return [{ jenis: 'ralat', teks: `${nama}: bukan fail ZIP yang sah.` }]
  }
  if (!hasil.fail.length) return [{ jenis: 'ralat', teks: `${nama}: tiada imej PNG, JPG atau WebP ditemui dalam pakej.` }]

  const mesej: Mesej[] = []
  const masuk = (f: (typeof hasil.fail)[number]): FailMasuk => ({
    nama: f.namaAsal ?? f.nama,
    jenis: f.jenis,
    blob: new Blob([f.data as Uint8Array<ArrayBuffer>], { type: f.jenis }),
  })
  // Fail yang nombornya tercatat dalam konfigurasi.json terus ke slot itu.
  const bernombor = hasil.fail.filter((f) => f.nombor !== null && f.nombor >= 1 && f.nombor <= JUMLAH_HALAMAN)
  const lain = hasil.fail.filter((f) => !bernombor.includes(f))
  let berjaya = 0
  for (const f of bernombor) if (await simpanSatu(masuk(f), f.nombor!, mesej)) berjaya++
  if (lain.length) {
    const terpakai = new Set([...berisi, ...bernombor.map((f) => f.nombor!)])
    const { tugasan, diabaikan } = agihkanFail(lain, JUMLAH_HALAMAN, terpakai)
    for (const t of tugasan) if (await simpanSatu(masuk(lain[t.fail]), t.nombor, mesej)) berjaya++
    for (const d of diabaikan) mesej.push({ jenis: 'ralat', teks: `${lain[d.fail].nama} diabaikan: ${SEBAB_ABAI[d.sebab]}.` })
  }
  mesej.unshift({
    jenis: berjaya ? 'berjaya' : 'ralat',
    teks: `Pakej ${nama}: ${berjaya} imej diimport${hasil.konfigurasi ? ' mengikut konfigurasi.json' : ''}.`,
  })
  return mesej
}

async function dimensi(blob: Blob): Promise<{ lebar: number; tinggi: number }> {
  try {
    const b = await createImageBitmap(blob)
    const d = { lebar: b.width, tinggi: b.height }
    b.close()
    return d
  } catch {
    return { lebar: 0, tinggi: 0 }
  }
}

/** Fail asal dalam public/halaman/ bagi satu halaman, jika boleh dibaca. */
async function failAsal(nombor: number): Promise<RekodPakej | null> {
  for (const url of calonImej(nombor)) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const blob = await res.blob()
      const nama = url.split('/').pop()!
      const jenis = jenisDaripadaNama(nama)
      if (!jenis || !blob.size) continue
      return { nombor, nama, jenis, ...(await dimensi(blob)), data: new Uint8Array(await blob.arrayBuffer()) }
    } catch {
      // Contohnya dibuka melalui file:// — fail asal tidak boleh dibaca oleh fetch.
    }
  }
  return null
}

/**
 * Bina pakej ZIP: imej dimuat naik, dan fail public/halaman/ bagi slot yang
 * tiada muat naik (jika boleh dibaca).
 */
export async function eksportPakej(asalWujud: SlotBerisi): Promise<{ zip: Blob; bilangan: number } | null> {
  const { imej } = dapatkanKeadaan()
  const rekod: RekodPakej[] = []
  for (const h of HALAMAN) {
    const i = imej[h.nombor]
    if (i) {
      const data = await dataImej(h.nombor)
      if (data) rekod.push({ nombor: h.nombor, nama: i.nama, jenis: i.jenis, lebar: i.lebar, tinggi: i.tinggi, data })
    } else if (asalWujud.has(h.nombor)) {
      const r = await failAsal(h.nombor)
      if (r) rekod.push(r)
    }
  }
  if (!rekod.length) return null
  const data = binaPakej(rekod, BUKU, JUMLAH_HALAMAN)
  return { zip: new Blob([data as Uint8Array<ArrayBuffer>], { type: 'application/zip' }), bilangan: rekod.length }
}

export { muatTurun } from './muatTurun'
