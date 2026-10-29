/**
 * Logik tulen untuk membaca master prompt daripada `kandungan/master-prompt.txt`.
 * Hanya teks di antara dua baris penanda diambil; arahan di luar penanda diabaikan.
 */

export const PENANDA_MULA = '=== MULA MASTER PROMPT ==='
export const PENANDA_TAMAT = '=== TAMAT MASTER PROMPT ==='

/**
 * Ambil teks di antara penanda. Baris kosong di hujung dibuang, tetapi baris,
 * inden dan simbol di dalam prompt dikekalkan tepat seperti ditampal.
 * Pulangkan '' jika penanda tiada atau ruang di antaranya kosong.
 */
export function ekstrakPrompt(mentah: string): string {
  const teks = mentah.replace(/\r\n?/g, '\n')
  const mula = teks.indexOf(PENANDA_MULA)
  if (mula < 0) return ''
  const dalam = teks.slice(mula + PENANDA_MULA.length)
  const tamat = dalam.indexOf(PENANDA_TAMAT)
  if (tamat < 0) return ''
  return dalam
    .slice(0, tamat)
    .replace(/^(?:[ \t]*\n)+/, '')
    .replace(/\s+$/, '')
}

/** Statistik ringkas untuk dipaparkan di halaman master prompt. */
export function statistikPrompt(prompt: string) {
  const perkataan = prompt.trim() ? prompt.trim().split(/\s+/).length : 0
  return {
    aksara: prompt.length,
    perkataan,
    baris: prompt ? prompt.split('\n').length : 0,
    /** Anggaran masa membaca pada 200 patah perkataan seminit (minimum 1 minit). */
    minitBaca: perkataan ? Math.max(1, Math.round(perkataan / 200)) : 0,
  }
}
