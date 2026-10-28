/**
 * Logik tulen (tanpa React) untuk mod persembahan automatik.
 * Dipisahkan supaya mudah diuji.
 */

export interface KeadaanAutoplay {
  indeks: number
  /** Masa (ms) yang telah berlalu pada slaid semasa. */
  berlalu: number
  bermain: boolean
  tamat: boolean
  /** Bertambah setiap kali persembahan dimulakan semula, supaya animasi dimainkan semula. */
  sesi: number
}

export type TindakanAutoplay =
  | { jenis: 'mula' }
  | { jenis: 'jeda' }
  | { jenis: 'ulang' }
  | { jenis: 'detik'; dt: number }
  | { jenis: 'seterusnya' }
  | { jenis: 'sebelumnya' }
  | { jenis: 'pergi'; indeks: number }

export interface ConfigAutoplay {
  jumlah: number
  tempoh: (indeks: number) => number
}

export const keadaanAwal: KeadaanAutoplay = {
  indeks: 0,
  berlalu: 0,
  bermain: false,
  tamat: false,
  sesi: 0,
}

function hadkan(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function pengurangAutoplay(
  keadaan: KeadaanAutoplay,
  tindakan: TindakanAutoplay,
  config: ConfigAutoplay,
): KeadaanAutoplay {
  const akhir = config.jumlah - 1

  switch (tindakan.jenis) {
    case 'mula':
      // Jika persembahan sudah tamat, "Mula" bermula semula dari awal.
      if (keadaan.tamat) return { ...keadaanAwal, bermain: true, sesi: keadaan.sesi + 1 }
      return { ...keadaan, bermain: true }

    case 'jeda':
      return { ...keadaan, bermain: false }

    case 'ulang':
      return { ...keadaanAwal, bermain: true, sesi: keadaan.sesi + 1 }

    case 'detik': {
      if (!keadaan.bermain) return keadaan
      let { indeks } = keadaan
      let berlalu = keadaan.berlalu + Math.max(0, tindakan.dt)
      while (berlalu >= config.tempoh(indeks)) {
        if (indeks >= akhir) {
          return { ...keadaan, indeks: akhir, berlalu: config.tempoh(akhir), bermain: false, tamat: true }
        }
        berlalu -= config.tempoh(indeks)
        indeks += 1
      }
      return { ...keadaan, indeks, berlalu }
    }

    case 'seterusnya':
      return { ...keadaan, indeks: hadkan(keadaan.indeks + 1, 0, akhir), berlalu: 0, tamat: false }

    case 'sebelumnya':
      return { ...keadaan, indeks: hadkan(keadaan.indeks - 1, 0, akhir), berlalu: 0, tamat: false }

    case 'pergi':
      return { ...keadaan, indeks: hadkan(tindakan.indeks, 0, akhir), berlalu: 0, tamat: false }
  }
}

/** Kemajuan slaid semasa, 0 hingga 1. */
export function kemajuanSlaid(keadaan: KeadaanAutoplay, config: ConfigAutoplay): number {
  const t = config.tempoh(keadaan.indeks)
  return t > 0 ? hadkan(keadaan.berlalu / t, 0, 1) : 1
}
