#!/usr/bin/env node
/**
 * Semak fail MP4 yang dieksport (Fasa 4). Tidak bergantung kepada pemapar:
 * semua ujian dibuat terhadap fail MP4 akhir menggunakan ffprobe/FFmpeg.
 *
 *   node scripts/semak-video.mjs eksport/tiktok-60s.mp4 [--json]
 *
 * Ujian:
 *   1. metadata: codec H.264, yuv420p, 1080×1920 (9:16, piksel segi empat), 30 fps,
 *      durasi 60 s, 1800 bingkai, tanpa audio (melainkan trek audio disertakan);
 *   2. bingkai animasi: bingkai berturut-turut berubah, dan setiap selakan halaman
 *      bergerak merentasi banyak bingkai (bukan potongan slaid);
 *   3. tiada ruang hitam di tepi bingkai;
 *   4. kod QR dalam adegan akhir boleh diimbas (saiz penuh dan dikecilkan) dan
 *      menghala ke pautan yang dijangka.
 *
 * Fail sampingan `<nama>.json` (ditulis oleh eksport-video.mjs) memberi nilai
 * yang dijangka. Hasil ditulis ke `<nama>-laporan.json` dan lembaran kenalan
 * `<nama>-lembaran.jpg`.
 */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import jsQR from 'jsqr'

const argv = process.argv.slice(2)
const modJson = argv.includes('--json')
const fail = resolve(argv.find((a) => !a.startsWith('--')) ?? 'eksport/tiktok-60s.mp4')
const asas = fail.replace(/\.mp4$/i, '')
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg'
const FFPROBE = process.env.FFPROBE_PATH || 'ffprobe'

function jalan(cmd, args, { maks = 512 * 1024 * 1024 } = {}) {
  return new Promise((lulus, gagal) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    const bahagian = []
    let saiz = 0
    let ralat = ''
    p.stdout.on('data', (d) => {
      saiz += d.length
      if (saiz <= maks) bahagian.push(d)
    })
    p.stderr.on('data', (d) => (ralat += d))
    p.on('error', (e) => gagal(new Error(`${cmd} tidak dapat dijalankan: ${e.message}`)))
    p.on('close', (kod) => (kod === 0 ? lulus(Buffer.concat(bahagian)) : gagal(new Error(`${cmd} gagal (kod ${kod}): ${ralat.slice(-500)}`))))
  })
}

/** Satu bingkai pada masa `s` sebagai RGBA (untuk jsQR), dengan saiz pilihan. */
async function bingkaiRgba(s, lebar, tinggi) {
  const skala = lebar ? ['-vf', `scale=${lebar}:${tinggi}:flags=area`] : []
  const data = await jalan(FFMPEG, ['-v', 'error', '-ss', String(s), '-i', fail, '-frames:v', '1', ...skala, '-f', 'rawvideo', '-pix_fmt', 'rgba', 'pipe:1'])
  return new Uint8ClampedArray(data.buffer, data.byteOffset, data.length)
}

const keputusan = []
function semak(nama, lulus, butiran) {
  keputusan.push({ nama, lulus: Boolean(lulus), butiran })
}

async function utama() {
  if (!existsSync(fail)) throw new Error(`Fail tiada: ${fail}`)
  const sisi = existsSync(asas + '.json') ? JSON.parse(readFileSync(asas + '.json', 'utf8')) : {}
  const spek = sisi.spesifikasi ?? { lebar: 1080, tinggi: 1920, fps: 30, tempohMs: 60_000, jumlahBingkai: 1800, peristiwaSelak: [] }
  const jangkaQr = sisi.teksQr ?? 'https://github.com/Nuraidah300376/ai-storybook-showcase/blob/main/prompts/MASTER-PROMPT-BUKU-CERITA.md'

  // 1. Metadata
  const probe = JSON.parse(
    (await jalan(FFPROBE, ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-print_format', 'json', fail])).toString(),
  )
  const v = probe.streams.find((s) => s.codec_type === 'video')
  const audio = probe.streams.filter((s) => s.codec_type === 'audio')
  const durasi = Number(probe.format.duration)
  const bingkai = Number(v?.nb_read_frames)
  semak('Format bekas MP4', /mp4/.test(probe.format.format_name), probe.format.format_name)
  semak('Codec video H.264', v?.codec_name === 'h264', `${v?.codec_name} (${v?.profile}, ${v?.pix_fmt})`)
  semak('Format piksel yuv420p (serasi TikTok/telefon)', v?.pix_fmt === 'yuv420p', v?.pix_fmt)
  semak('Resolusi 1080×1920', v?.width === spek.lebar && v?.height === spek.tinggi, `${v?.width}×${v?.height}`)
  semak(
    'Nisbah 9:16, piksel segi empat',
    v && v.width * 16 === v.height * 9 && (!v.sample_aspect_ratio || ['1:1', '0:1'].includes(v.sample_aspect_ratio)),
    `SAR ${v?.sample_aspect_ratio ?? '1:1'}`,
  )
  semak('Kadar bingkai 30 fps', v?.r_frame_rate === `${spek.fps}/1` && v?.avg_frame_rate === `${spek.fps}/1`, `${v?.r_frame_rate} (purata ${v?.avg_frame_rate})`)
  semak('Durasi 60 saat', Math.abs(durasi - spek.tempohMs / 1000) <= 0.05, `${durasi.toFixed(3)} s`)
  semak(`Bilangan bingkai ${spek.jumlahBingkai}`, bingkai === spek.jumlahBingkai, String(bingkai))
  if (sisi.audio) semak('Trek audio AAC', audio.length === 1 && audio[0].codec_name === 'aac', audio.map((a) => a.codec_name).join(', ') || 'tiada')
  else semak('Tanpa audio (tiada trek disediakan)', audio.length === 0, audio.length ? `${audio.length} trek audio` : 'tiada trek audio')

  // 2. Bingkai animasi: beza purata antara bingkai berturut-turut (kelabu 135×240).
  const L = 135
  const T = 240
  const kelabu = await jalan(FFMPEG, ['-v', 'error', '-i', fail, '-vf', `scale=${L}:${T}:flags=area,format=gray`, '-f', 'rawvideo', 'pipe:1'])
  const n = Math.floor(kelabu.length / (L * T))
  const beza = []
  for (let i = 1; i < n; i++) {
    let jum = 0
    const a = (i - 1) * L * T
    const b = i * L * T
    for (let j = 0; j < L * T; j++) jum += Math.abs(kelabu[a + j] - kelabu[b + j])
    beza.push(jum / (L * T))
  }
  const berubah = beza.filter((d) => d > 0).length
  const nisbahBerubah = berubah / Math.max(1, beza.length)
  semak('Bingkai animasi sebenar (bingkai berturut-turut berubah)', nisbahBerubah >= 0.9, `${berubah}/${beza.length} pasangan bingkai berbeza (${(nisbahBerubah * 100).toFixed(1)}%)`)

  const fps = spek.fps
  const selak = (spek.peristiwaSelak ?? []).map((p) => {
    const a = Math.floor((p.mulaMs / 1000) * fps)
    const b = Math.ceil(((p.mulaMs + p.tempohMs) / 1000) * fps)
    const tetingkap = beza.slice(a, b)
    const bergerak = tetingkap.filter((d) => d > 0.3).length
    const jumlah = tetingkap.reduce((s, d) => s + d, 0)
    const puncak = Math.max(0, ...tetingkap)
    return { halaman: p.halaman, masaS: p.mulaMs / 1000, bingkaiBergerak: bergerak, bingkai: tetingkap.length, puncakPerJumlah: jumlah ? puncak / jumlah : 1 }
  })
  if (selak.length) {
    // Selakan sebenar: gerakan tersebar merentasi banyak bingkai; potongan slaid tertumpu pada satu bingkai.
    const okSelak = selak.filter((s) => s.bingkaiBergerak >= Math.min(10, s.bingkai * 0.5) && s.puncakPerJumlah < 0.35)
    semak(
      'Animasi selak halaman 3D (setiap selakan merentasi banyak bingkai)',
      okSelak.length === selak.length,
      `${okSelak.length}/${selak.length} selakan; bingkai bergerak setiap selakan: ${selak.map((s) => s.bingkaiBergerak).join(', ')}`,
    )
  }

  // 3. Ruang hitam di tepi: jalur 6 piksel di setiap sisi pada beberapa masa.
  const masaTepi = [1, 8, 20, 40, 48, 57]
  const tepiGagal = []
  let minTepi = 255
  for (const s of masaTepi) {
    const px = await bingkaiRgba(s)
    const W = spek.lebar
    const H = spek.tinggi
    const jalur = []
    for (let y = 0; y < H; y += 4) for (const x of [0, 2, 5, W - 6, W - 3, W - 1]) jalur.push((y * W + x) * 4)
    for (let x = 0; x < W; x += 4) for (const y of [0, 2, 5, H - 6, H - 3, H - 1]) jalur.push((y * W + x) * 4)
    let hitam = 0
    let jum = 0
    for (const i of jalur) {
      const m = Math.max(px[i], px[i + 1], px[i + 2])
      jum += m
      if (m <= 4) hitam++
    }
    const purata = jum / jalur.length
    minTepi = Math.min(minTepi, purata)
    if (hitam / jalur.length > 0.05) tepiGagal.push(`${s}s: ${((hitam / jalur.length) * 100).toFixed(0)}% piksel hitam`)
  }
  semak('Tiada ruang hitam di tepi bingkai', tepiGagal.length === 0, tepiGagal.join('; ') || `kecerahan tepi minimum ${minTepi.toFixed(1)}/255 (latar navy, bukan hitam)`)

  // 4. Kod QR dalam adegan akhir.
  const ujianQr = []
  for (const s of [54, 56, 58, 59.9]) {
    for (const [lebar, tinggi] of [
      [spek.lebar, spek.tinggi],
      [540, 960],
      [360, 640],
    ]) {
      const px = await bingkaiRgba(s, lebar === spek.lebar ? 0 : lebar, tinggi)
      const kod = jsQR(px, lebar, tinggi, { inversionAttempts: 'dontInvert' })
      ujianQr.push({ masaS: s, saiz: `${lebar}×${tinggi}`, teks: kod?.data ?? null, betul: kod?.data === jangkaQr })
    }
  }
  const qrOk = ujianQr.filter((q) => q.betul).length
  semak(
    'Kod QR boleh diimbas dan menghala ke pautan betul',
    qrOk === ujianQr.length,
    `${qrOk}/${ujianQr.length} imbasan berjaya (1080×1920, 540×960, 360×640) → ${jangkaQr}`,
  )

  // Lembaran kenalan untuk semakan visual.
  const masaLembaran = [1.5, 4, 6.5, 10, 13.2, 14.1, 21.8, 33, 40, 49, 54, 59]
  const pilih = masaLembaran.map((s) => `between(t\\,${s}\\,${s + 1 / fps - 0.001})`).join('+')
  await jalan(FFMPEG, ['-v', 'error', '-y', '-i', fail, '-vf', `select='${pilih}',scale=270:480,tile=6x2:padding=6:color=0x111111`, '-frames:v', '1', '-q:v', '3', asas + '-lembaran.jpg'])

  const lulusSemua = keputusan.every((k) => k.lulus)
  const laporan = {
    fail,
    lulus: lulusSemua,
    saizMb: Math.round((Number(probe.format.size) / 1024 / 1024) * 10) / 10,
    kadarBitMbps: Math.round((Number(probe.format.bit_rate) / 1e6) * 10) / 10,
    keputusan,
    selak,
    ujianQr,
    lembaran: asas + '-lembaran.jpg',
  }
  writeFileSync(asas + '-laporan.json', JSON.stringify(laporan, null, 2))
  if (modJson) process.stdout.write(JSON.stringify(laporan) + '\n')
  else {
    console.log(`Semakan ${fail} (${laporan.saizMb} MB, ${laporan.kadarBitMbps} Mbps)`)
    for (const k of keputusan) console.log(`  ${k.lulus ? '✔' : '✘'} ${k.nama} — ${k.butiran}`)
    console.log(lulusSemua ? 'SEMUA SEMAKAN LULUS' : 'ADA SEMAKAN GAGAL')
  }
  process.exit(lulusSemua ? 0 : 1)
}

utama().catch((e) => {
  const mesej = e instanceof Error ? e.message : String(e)
  if (modJson) process.stdout.write(JSON.stringify({ fail, lulus: false, ralat: mesej, keputusan }) + '\n')
  else console.error(`✘ Semakan gagal dijalankan: ${mesej}`)
  process.exit(1)
})
