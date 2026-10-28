/**
 * Logik tulen untuk mengesahkan fail imej dan menyusunnya ke slot halaman
 * mengikut nombor dalam nama fail.
 */

export const JENIS_DISOKONG = ['image/png', 'image/jpeg', 'image/webp'] as const
export const SAMBUNGAN_DISOKONG = ['png', 'jpg', 'jpeg', 'webp'] as const
/** Nilai `accept` untuk <input type="file">. */
export const TERIMA_FAIL = '.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp'
/** Had saiz satu fail (MB). Melindungi storan pelayar daripada fail yang terlalu besar. */
export const SAIZ_MAKS_MB = 25

/** Nisbah A5 potret (lebar ÷ tinggi = 148 ÷ 210). */
export const NISBAH_A5 = 148 / 210

export function sambunganFail(nama: string): string {
  const titik = nama.lastIndexOf('.')
  return titik < 0 ? '' : nama.slice(titik + 1).toLowerCase()
}

/** Benar jika fail berformat PNG, JPG, JPEG atau WebP (ikut jenis MIME atau sambungan). */
export function failDisokong(nama: string, jenis = ''): boolean {
  if ((JENIS_DISOKONG as readonly string[]).includes(jenis)) return true
  return (SAMBUNGAN_DISOKONG as readonly string[]).includes(sambunganFail(nama))
}

/** Jenis MIME berdasarkan sambungan, untuk fail tanpa jenis (contohnya dari pakej ZIP). */
export function jenisDaripadaNama(nama: string): string {
  const ext = sambunganFail(nama)
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  return ''
}

/** Sambungan piawai bagi jenis MIME yang disokong. */
export function sambunganBagiJenis(jenis: string): string {
  if (jenis === 'image/png') return 'png'
  if (jenis === 'image/webp') return 'webp'
  return 'jpg'
}

/** Buang folder dan sambungan: "pakej/halaman-03.png" → "halaman-03". */
function namaAsas(nama: string): string {
  const fail = nama.split(/[\\/]/).pop() ?? nama
  const titik = fail.lastIndexOf('.')
  return titik > 0 ? fail.slice(0, titik) : fail
}

const KATA_KUNCI = /(?:halaman|hal|muka\s*surat|ms|page|pg|p)[\s._-]*0*(\d{1,3})(?!\d)/i

/**
 * Cari nombor halaman dalam nama fail.
 *
 * 1. Nombor selepas kata kunci (halaman, hal, ms, page, pg, p) diutamakan:
 *    "page_12_v2" → 12.
 * 2. Jika tiada, nombor pertama dalam julat 1..jumlah: "Amanah 2024 - 03" → 3.
 *
 * Pulangkan `null` jika tiada nombor yang sah.
 */
export function nomborDaripadaNama(nama: string, jumlah: number): number | null {
  const asas = namaAsas(nama)
  const kunci = KATA_KUNCI.exec(asas)
  if (kunci) {
    const n = Number(kunci[1])
    if (n >= 1 && n <= jumlah) return n
  }
  for (const m of asas.matchAll(/\d+/g)) {
    const n = Number(m[0])
    if (n >= 1 && n <= jumlah) return n
  }
  return null
}

/** Perbandingan nama "semula jadi": halaman-2 sebelum halaman-10. */
export function bandingNama(a: string, b: string): number {
  return a.localeCompare(b, 'ms', { numeric: true, sensitivity: 'base' })
}

export interface Tugasan {
  /** Indeks fail dalam senarai input. */
  fail: number
  /** Nombor slot (1..jumlah). */
  nombor: number
  sebab: 'nombor-nama' | 'slot-kosong'
}

export interface Diabaikan {
  fail: number
  sebab: 'format' | 'pendua' | 'tiada-slot'
}

export interface HasilAgihan {
  tugasan: Tugasan[]
  diabaikan: Diabaikan[]
}

/**
 * Agihkan fail ke slot halaman.
 *
 * - Fail bernombor (lihat `nomborDaripadaNama`) masuk ke slot nombor itu,
 *   menggantikan imej sedia ada.
 * - Fail kedua dengan nombor yang sama diabaikan (pendua).
 * - Fail tanpa nombor mengisi slot yang masih kosong, ikut susunan nama.
 */
export function agihkanFail(
  fail: readonly { nama: string; jenis?: string }[],
  jumlah: number,
  terisi: ReadonlySet<number> = new Set(),
): HasilAgihan {
  const tugasan: Tugasan[] = []
  const diabaikan: Diabaikan[] = []
  const diambil = new Set<number>()
  const tanpaNombor: number[] = []

  fail.forEach((f, i) => {
    if (!failDisokong(f.nama, f.jenis)) {
      diabaikan.push({ fail: i, sebab: 'format' })
      return
    }
    const n = nomborDaripadaNama(f.nama, jumlah)
    if (n === null) {
      tanpaNombor.push(i)
    } else if (diambil.has(n)) {
      diabaikan.push({ fail: i, sebab: 'pendua' })
    } else {
      diambil.add(n)
      tugasan.push({ fail: i, nombor: n, sebab: 'nombor-nama' })
    }
  })

  tanpaNombor.sort((a, b) => bandingNama(fail[a].nama, fail[b].nama))
  let slot = 1
  for (const i of tanpaNombor) {
    while (slot <= jumlah && (diambil.has(slot) || terisi.has(slot))) slot++
    if (slot > jumlah) {
      diabaikan.push({ fail: i, sebab: 'tiada-slot' })
      continue
    }
    diambil.add(slot)
    tugasan.push({ fail: i, nombor: slot, sebab: 'slot-kosong' })
  }

  tugasan.sort((a, b) => a.nombor - b.nombor)
  diabaikan.sort((a, b) => a.fail - b.fail)
  return { tugasan, diabaikan }
}

/** Benar jika nisbah imej berbeza lebih daripada `toleransi` (pecahan) daripada A5 potret. */
export function bukanA5(lebar: number, tinggi: number, toleransi = 0.03): boolean {
  if (!lebar || !tinggi) return false
  return Math.abs(lebar / tinggi / NISBAH_A5 - 1) > toleransi
}

export function formatSaiz(bait: number): string {
  if (bait < 1024) return `${bait} B`
  if (bait < 1024 * 1024) return `${Math.round(bait / 1024)} KB`
  return `${(bait / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}
