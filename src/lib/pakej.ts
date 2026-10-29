/**
 * Eksport dan import pakej imej halaman (fail ZIP).
 *
 * Struktur pakej:
 *   konfigurasi.json        ← maklumat buku dan senarai halaman
 *   BACA-SAYA.txt           ← cara menggunakan semula pakej
 *   halaman/halaman-01.png  ← fail imej asal, tanpa dimampat semula
 *   ...
 *
 * Folder `halaman/` boleh disalin terus ke `public/halaman/` dalam projek
 * untuk penyimpanan kekal.
 */
import { strFromU8, strToU8, unzipSync, zipSync, type Zippable } from 'fflate'
import { bandingNama, failDisokong, jenisDaripadaNama, sambunganBagiJenis } from './susunFail'

export const VERSI_PAKEJ = 1
export const NAMA_KONFIGURASI = 'konfigurasi.json'

export interface RekodPakej {
  nombor: number
  nama: string
  jenis: string
  lebar: number
  tinggi: number
  data: Uint8Array
}

export interface HalamanKonfigurasi {
  nombor: number
  fail: string
  namaAsal: string
  jenis: string
  saiz: number
  lebar: number
  tinggi: number
}

export interface Konfigurasi {
  aplikasi: 'ai-storybook-showcase'
  versi: number
  buku: { tajuk: string; penulis: string }
  dieksport: string
  jumlahHalaman: number
  halaman: HalamanKonfigurasi[]
}

export function namaFailPakej(nombor: number, jenis: string): string {
  return `halaman-${String(nombor).padStart(2, '0')}.${sambunganBagiJenis(jenis)}`
}

function bacaSaya(buku: { tajuk: string }, bilangan: number): string {
  return [
    `Pakej imej halaman: ${buku.tajuk}`,
    `Mengandungi ${bilangan} imej halaman dan konfigurasi.json.`,
    '',
    'Cara 1 — Import semula ke aplikasi:',
    '  Buka bahagian PENGURUS HALAMAN BUKU, tekan "Import Pakej" dan pilih fail ZIP ini.',
    '',
    'Cara 2 — Simpan secara kekal dalam projek:',
    '  Nyahzip pakej ini, kemudian salin semua fail dalam folder halaman/',
    '  ke folder public/halaman/ dalam projek, dan commit ke GitHub.',
    '',
  ].join('\r\n')
}

export function binaPakej(
  rekod: readonly RekodPakej[],
  buku: { tajuk: string; penulis: string },
  jumlahHalaman: number,
  tarikh = new Date(),
): Uint8Array {
  const tersusun = [...rekod].sort((a, b) => a.nombor - b.nombor)
  const konfigurasi: Konfigurasi = {
    aplikasi: 'ai-storybook-showcase',
    versi: VERSI_PAKEJ,
    buku: { tajuk: buku.tajuk, penulis: buku.penulis },
    dieksport: tarikh.toISOString(),
    jumlahHalaman,
    halaman: tersusun.map((r) => ({
      nombor: r.nombor,
      fail: `halaman/${namaFailPakej(r.nombor, r.jenis)}`,
      namaAsal: r.nama,
      jenis: r.jenis,
      saiz: r.data.byteLength,
      lebar: r.lebar,
      tinggi: r.tinggi,
    })),
  }
  const isi: Zippable = {
    [NAMA_KONFIGURASI]: strToU8(JSON.stringify(konfigurasi, null, 2)),
    'BACA-SAYA.txt': strToU8(bacaSaya(buku, tersusun.length)),
  }
  // Imej sudah dimampat; simpan sahaja (level 0) supaya bait asal kekal sama.
  for (const r of tersusun) isi[`halaman/${namaFailPakej(r.nombor, r.jenis)}`] = [r.data, { level: 0 }]
  return zipSync(isi, { level: 6 })
}

export interface FailPakej {
  /** Nama fail tanpa folder. */
  nama: string
  jenis: string
  data: Uint8Array
  /** Nombor halaman daripada konfigurasi.json, jika ada. */
  nombor: number | null
  /** Nama asal fail sebelum dieksport, jika ada. */
  namaAsal: string | null
}

export interface HasilBacaPakej {
  fail: FailPakej[]
  konfigurasi: Konfigurasi | null
}

function bacaKonfigurasi(data: Uint8Array | undefined): Konfigurasi | null {
  if (!data) return null
  try {
    const k = JSON.parse(strFromU8(data)) as Partial<Konfigurasi>
    if (k.aplikasi !== 'ai-storybook-showcase' || !Array.isArray(k.halaman)) return null
    return k as Konfigurasi
  } catch {
    return null
  }
}

/**
 * Baca pakej ZIP. Menerima pakej yang dieksport oleh aplikasi ini (dengan
 * konfigurasi.json) atau sebarang ZIP berisi imej PNG/JPG/WebP.
 */
export function bacaPakej(zip: Uint8Array): HasilBacaPakej {
  const isi = unzipSync(zip, {
    // Langkau fail sistem macOS dan fail bukan imej sebelum dinyahmampat.
    filter: (f) => !f.name.startsWith('__MACOSX/') && (f.name.endsWith(NAMA_KONFIGURASI) || failDisokong(f.name)),
  })
  const laluanKonfigurasi = Object.keys(isi).find((n) => n === NAMA_KONFIGURASI || n.endsWith(`/${NAMA_KONFIGURASI}`))
  const konfigurasi = bacaKonfigurasi(laluanKonfigurasi ? isi[laluanKonfigurasi] : undefined)
  const akar = laluanKonfigurasi ? laluanKonfigurasi.slice(0, -NAMA_KONFIGURASI.length) : ''

  const ikutLaluan = new Map(konfigurasi?.halaman.map((h) => [akar + h.fail, h]) ?? [])
  const fail: FailPakej[] = Object.keys(isi)
    .filter((n) => !n.endsWith('/') && failDisokong(n))
    .sort(bandingNama)
    .map((laluan) => {
      const h = ikutLaluan.get(laluan)
      const nama = laluan.split('/').pop() ?? laluan
      return {
        nama,
        jenis: h?.jenis || jenisDaripadaNama(nama),
        data: isi[laluan],
        nombor: h && Number.isInteger(h.nombor) ? h.nombor : null,
        namaAsal: h?.namaAsal ?? null,
      }
    })
  return { fail, konfigurasi }
}
