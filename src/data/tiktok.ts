/**
 * Tetapan kandungan TikTok Cinematic Showcase (9:16, 1080×1920, 60 saat).
 * Semua teks di sini boleh disunting tanpa menyentuh komponen.
 */

/**
 * URL AWAM halaman perkongsian master prompt (contohnya halaman `prompt/` di
 * GitHub Pages). BIARKAN KOSONG sehingga halaman itu benar-benar diterbitkan
 * dan boleh dibuka di telefon lain. Lihat docs/PANDUAN-GITHUB-PAGES.md.
 *
 * Selagi kosong, kod QR dipaparkan sebagai placeholder "BELUM DIKONFIGURASI".
 * URL juga boleh ditetapkan sementara dalam aplikasi (disimpan dalam pelayar itu sahaja).
 */
export const URL_PERKONGSIAN_PROMPT = ''

/** Kawasan asas pentas dalam piksel. */
export const PENTAS = { lebar: 1080, tinggi: 1920 } as const

/**
 * Zon selamat TikTok (piksel pada pentas 1080×1920): kawasan yang tidak dilitupi
 * bar atas, kapsyen/muzik di bawah dan butang suka/komen/kongsi di kanan.
 * Semua teks penting diletakkan di dalam zon ini.
 */
export const ZON_SELAMAT = { atas: 220, bawah: 440, kiri: 90, kanan: 150 } as const

/**
 * Bahagian utama master prompt yang diperkenalkan pada saat 35–45.
 * SEMAK DAN SESUAIKAN supaya sepadan dengan susunan master prompt asal anda.
 */
export const STRUKTUR_PROMPT: { tajuk: string; huraian: string }[] = [
  { tajuk: 'Peranan & Matlamat', huraian: 'AI sebagai penulis dan pereka buku' },
  { tajuk: 'Identiti Buku', huraian: 'Tajuk, pembaca sasaran dan nilai murni' },
  { tajuk: 'Watak & Gaya Visual', huraian: 'Rupa watak dan gaya kekal konsisten' },
  { tajuk: 'Format Halaman A5', huraian: 'Susun atur teks dan ilustrasi' },
  { tajuk: 'Aliran Kerja Berperingkat', huraian: 'Rancang, luluskan, kemudian jana' },
]

/** Tiga langkah aliran kerja yang diterangkan pada saat 45–52. */
export const ALIRAN_KERJA: { langkah: string; huraian: string }[] = [
  { langkah: 'RANCANG', huraian: 'AI merancang cerita dan semua halaman' },
  { langkah: 'LULUS', huraian: 'Anda semak dan luluskan rancangan' },
  { langkah: 'JANA SATU HALAMAN', huraian: 'Satu halaman pada satu masa, konsisten' },
]

/** Teks penutup bersama kod QR (saat 52–60). */
export const PENUTUP_QR = {
  tajuk: 'Dapatkan MASTER PROMPT PENUH',
  arahan: ['Imbas kod QR dengan kamera telefon', 'Buka halaman dan tekan SALIN PROMPT'],
  arahanTanpaQR: 'Pautan perkongsian akan dikongsi tidak lama lagi',
} as const
