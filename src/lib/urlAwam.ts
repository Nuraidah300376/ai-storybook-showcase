/**
 * Pengesahan URL perkongsian prompt sebelum dijadikan kod QR.
 *
 * Fungsi ini hanya menyemak BENTUK URL (https, nama hos awam). Ia tidak dapat
 * membuktikan bahawa halaman itu benar-benar wujud atau boleh dibuka oleh orang
 * lain — pemilik mesti menguji pautan itu pada peranti lain sebelum merakam.
 */

export type KeputusanUrl = { sah: true; url: string } | { sah: false; sebab: string }

const HOS_TEMPATAN = /^(localhost|.*\.localhost|.*\.local|.*\.internal|.*\.lan|.*\.home\.arpa)$/i

function ipPersendirian(hos: string): boolean {
  const m = hos.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])]
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    )
  }
  // IPv6 dalam kurungan: gelung balik, setempat pautan dan alamat unik setempat.
  if (hos.startsWith('[')) return /^\[(::1?|fe80:.*|f[cd][0-9a-f]{2}:.*)\]$/i.test(hos)
  return false
}

export function sahkanUrlAwam(input: string): KeputusanUrl {
  const teks = input.trim()
  if (!teks) return { sah: false, sebab: 'URL belum diisi.' }
  if (/\s/.test(teks)) return { sah: false, sebab: 'URL tidak boleh mengandungi ruang kosong.' }

  let url: URL
  try {
    url = new URL(teks)
  } catch {
    return { sah: false, sebab: 'Format URL tidak sah. Mulakan dengan https://' }
  }

  if (url.protocol !== 'https:') {
    return { sah: false, sebab: 'Gunakan pautan https:// supaya selamat dibuka di telefon penonton.' }
  }
  if (url.username || url.password) return { sah: false, sebab: 'URL tidak boleh mengandungi nama pengguna atau kata laluan.' }

  const hos = url.hostname.toLowerCase()
  if (HOS_TEMPATAN.test(hos) || ipPersendirian(hos)) {
    return { sah: false, sebab: 'Ini alamat setempat/peribadi. Penonton TikTok tidak dapat membukanya.' }
  }
  if (!hos.startsWith('[') && !/^\d+(\.\d+){3}$/.test(hos) && !/\.[a-z][a-z0-9-]*[a-z0-9]$/i.test(hos)) {
    return { sah: false, sebab: 'Nama hos mesti domain awam, contohnya nama.github.io.' }
  }
  if (teks.length > 1200) return { sah: false, sebab: 'URL terlalu panjang untuk kod QR yang mudah diimbas.' }

  return { sah: true, url: url.href }
}
