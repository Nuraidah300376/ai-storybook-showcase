#!/usr/bin/env node
/**
 * Eksport persembahan TikTok 60 saat kepada MP4 (Fasa 4).
 *
 * Kaedah: halaman `#render-tiktok` dibuka dalam Chromium tanpa kepala
 * (Playwright) dengan jam maya (scripts/jam-maya.mjs). Bagi setiap bingkai,
 * jam digerakkan tepat 1/30 saat, pelayar melukis pentas 1080×1920 dan tangkapan
 * PNG dihantar terus kepada FFmpeg (libx264). Animasi selak 3D, kapsyen dan
 * kod QR ialah DOM/CSS sebenar aplikasi — bukan imej statik.
 *
 * Penggunaan:
 *   node scripts/eksport-video.mjs                      # paparkan folder dist/ (npm run build dahulu)
 *   node scripts/eksport-video.mjs --url http://localhost:5173/
 *   node scripts/eksport-video.mjs --keluaran eksport/video.mp4 --audio muzik.mp3
 *
 * Pilihan:
 *   --url URL         alamat aplikasi yang sedang berjalan (lalai: pelayan statik bagi --dist)
 *   --dist DIR        folder binaan (lalai: dist)
 *   --keluaran FAIL   fail MP4 (lalai: eksport/tiktok-60s.mp4)
 *   --data FAIL       JSON muatan: imej dimuat naik dan kod QR tersuai (pilihan)
 *   --audio FAIL      trek audio (pilihan). Tanpa pilihan ini video tidak mempunyai audio.
 *   --crf N           kualiti x264, lebih kecil lebih baik (lalai: 18)
 *   --preset NAMA     preset x264 (lalai: medium)
 *   --json            cetak kemajuan sebagai baris JSON (untuk butang dalam aplikasi)
 *   --dari N --had N  (ujian sahaja) mula pada bingkai N dan hadkan bilangan bingkai
 */
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { pasangJamMaya } from './jam-maya.mjs'

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function bacaArgumen(argv) {
  const a = { dist: 'dist', keluaran: 'eksport/tiktok-60s.mp4', crf: '18', preset: 'medium', json: false }
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]
    if (k === '--json') a.json = true
    else if (k.startsWith('--')) a[k.slice(2)] = argv[++i]
  }
  return a
}

const arg = bacaArgumen(process.argv.slice(2))

function lapor(jenis, data = {}) {
  if (arg.json) process.stdout.write(JSON.stringify({ jenis, ...data }) + '\n')
  else if (jenis === 'fasa') console.log(`• ${data.teks}`)
  else if (jenis === 'kemajuan') {
    if (data.bingkai % 30 === 0 || data.bingkai === data.jumlah)
      process.stdout.write(`\r  Bingkai ${data.bingkai}/${data.jumlah} (${Math.round((data.bingkai / data.jumlah) * 100)}%)   `)
    if (data.bingkai === data.jumlah) process.stdout.write('\n')
  } else if (jenis === 'berjaya') console.log(`✔ MP4 siap: ${data.fail}`)
  else if (jenis === 'gagal') console.error(`✘ Eksport gagal: ${data.mesej}`)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
}

/** Pelayan statik ringkas bagi folder binaan (tiada kebergantungan tambahan). */
function pelayanStatik(folder) {
  const akar = resolve(folder)
  const pelayan = createServer((req, res) => {
    const laluan = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
    let fail = resolve(join(akar, laluan))
    if (fail !== akar && !fail.startsWith(akar + sep)) {
      res.writeHead(403).end()
      return
    }
    if (existsSync(fail) && statSync(fail).isDirectory()) fail = join(fail, 'index.html')
    if (!existsSync(fail)) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(fail).toLowerCase()] ?? 'application/octet-stream' })
    createReadStream(fail).pipe(res)
  })
  return new Promise((lulus) => pelayan.listen(0, '127.0.0.1', () => lulus(pelayan)))
}

const tidur = (ms) => new Promise((r) => setTimeout(r, ms))

function mulaFfmpeg(spek, keluaran) {
  const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg'
  const tempohS = (spek.tempohMs / 1000).toFixed(3)
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(spek.fps), '-c:v', 'png', '-i', 'pipe:0']
  if (arg.audio) args.push('-i', resolve(arg.audio))
  args.push(
    '-map', '0:v',
    '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', arg.preset, '-crf', String(arg.crf),
    '-profile:v', 'high', '-level:v', '4.1',
    '-r', String(spek.fps), '-g', String(spek.fps * 2),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
    '-tag:v', 'avc1',
  )
  if (arg.audio) args.push('-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad')
  else args.push('-an')
  args.push(...(arg.had || arg.dari ? [] : ['-t', tempohS]), '-movflags', '+faststart', keluaran)
  const p = spawn(ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] })
  let ralat = ''
  p.stderr.on('data', (d) => (ralat += d))
  const tamat = new Promise((lulus, gagal) => {
    p.on('error', (e) => gagal(new Error(`FFmpeg tidak dapat dijalankan (${e.message}). Pasang FFmpeg atau tetapkan FFMPEG_PATH.`)))
    p.on('close', (kod) => (kod === 0 ? lulus() : gagal(new Error(`FFmpeg gagal (kod ${kod}): ${ralat.trim().slice(-800)}`))))
  })
  return { p, tamat }
}

function tulis(aliran, data) {
  return new Promise((lulus, gagal) => {
    const ok = aliran.write(data, (e) => e && gagal(e))
    if (ok) lulus()
    else aliran.once('drain', lulus)
  })
}

async function utama() {
  const keluaran = resolve(arg.keluaran)
  mkdirSync(dirname(keluaran), { recursive: true })
  const muatan = arg.data ? JSON.parse(readFileSync(resolve(arg.data), 'utf8')) : { kodQr: null, imej: [] }

  let pelayan = null
  let url = arg.url
  if (!url) {
    const dist = resolve(AKAR, arg.dist)
    if (!existsSync(join(dist, 'index.html'))) throw new Error(`Folder binaan ${arg.dist}/ tiada. Jalankan "npm run build" dahulu.`)
    pelayan = await pelayanStatik(dist)
    url = `http://127.0.0.1:${pelayan.address().port}/`
  }
  const urlRender = new URL('#render-tiktok', url).href

  lapor('fasa', { teks: 'Membuka Chromium tanpa kepala' })
  // Satu pelayar sahaja: pelayar selari tidak lebih pantas (setiap pelayar tetap
  // melukis setiap bingkai yang dilalui jamnya) dan kurang boleh diulang.
  const pelayar = await chromium.launch({ args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--run-all-compositor-stages-before-draw', '--disable-features=PaintHolding'] })
  const t0 = performance.now()
  try {
    const { halaman, cdp, spek, sedia, mulaJam, ralatHalaman } = await bukaHalaman(pelayar, urlRender, muatan)
    lapor('fasa', {
      teks: `Imej sedia: ${sedia.imejDimuatNaik} dimuat naik + ${sedia.imejAsal} daripada public/halaman · QR → ${sedia.teksQr}`,
      sedia,
    })
    if (sedia.imejDimuatNaik + sedia.imejAsal < 12) lapor('fasa', { teks: 'Amaran: tidak semua 12 imej ditemui; placeholder akan dipaparkan.' })

    const { p: ffmpeg, tamat } = mulaFfmpeg(spek, keluaran)
    ffmpeg.stdin.on('error', () => {})

    const selang = 1000 / spek.fps
    const dari = Math.max(0, Number(arg.dari) || 0)
    const jumlah = Math.min(spek.jumlahBingkai - dari, Number(arg.had) || Infinity)
    lapor('fasa', { teks: `Memaparkan ${jumlah} bingkai (${spek.lebar}×${spek.tinggi}, ${spek.fps} fps)` })

    const paparSemua = async () => {
      await halaman.evaluate(() => window.__eksportTikTok.mula())
      for (let n = 0; n < dari + jumlah; n++) {
        // Bingkai ke-n = keadaan tepat pada n/fps saat selepas garis masa bermula.
        await halaman.evaluate((t) => window.__jamMaya.bingkai(t), mulaJam + n * selang)
        if (n < dari) continue
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false })
        await tulis(ffmpeg.stdin, Buffer.from(data, 'base64'))
        lapor('kemajuan', { bingkai: n - dari + 1, jumlah })
      }
      ffmpeg.stdin.end()
    }
    // FFmpeg yang gagal di tengah jalan menghentikan pemaparan serta-merta.
    await Promise.race([tamat, paparSemua()])
    lapor('fasa', { teks: 'Mengekod MP4 (H.264)' })
    await tamat
    if (ralatHalaman.length) lapor('fasa', { teks: `Amaran halaman: ${[...new Set(ralatHalaman)].slice(0, 3).join(' | ')}` })

    const maklumat = {
      fail: keluaran,
      spesifikasi: spek,
      teksQr: sedia.teksQr,
      audio: Boolean(arg.audio),
      imejDimuatNaik: sedia.imejDimuatNaik,
      imejAsal: sedia.imejAsal,
      masaPemaparanS: Math.round((performance.now() - t0) / 100) / 10,
      dijana: new Date().toISOString(),
    }
    writeFileSync(keluaran.replace(/\.mp4$/i, '') + '.json', JSON.stringify(maklumat, null, 2))
    lapor('berjaya', maklumat)
  } finally {
    await pelayar.close().catch(() => {})
    pelayan?.close()
  }
}

/** Buka satu halaman pemaparan, sediakan imej/QR/fon dan pulangkan kawalannya. */
async function bukaHalaman(pelayar, urlRender, muatan) {
  const konteks = await pelayar.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    colorScheme: 'dark',
  })
  await konteks.addInitScript(pasangJamMaya)
  const halaman = await konteks.newPage()
  const ralatHalaman = []
  halaman.on('pageerror', (e) => ralatHalaman.push(e.message))
  await halaman.goto(urlRender, { waitUntil: 'load' })
  // Tunggu dari Node (bukan waitForFunction: pemasa halaman dikawal jam maya).
  for (let i = 0; ; i++) {
    if (await halaman.evaluate(() => Boolean(window.__eksportTikTok))) break
    if (i > 300) throw new Error(`Halaman pemaparan tidak bersedia. ${ralatHalaman.join(' ')}`)
    await tidur(100)
  }
  const spek = await halaman.evaluate(() => window.__eksportTikTok.spesifikasi)
  await halaman.setViewportSize({ width: spek.lebar, height: spek.tinggi })
  const sedia = await halaman.evaluate((m) => window.__eksportTikTok.sediakan(m), muatan)
  // Biarkan pelukisan awal (latar, fon, orb) stabil sebelum garis masa bermula.
  for (let i = 0; i < 10; i++) await halaman.evaluate(() => window.__jamMaya.rehat(16))
  const mulaJam = await halaman.evaluate(() => window.__jamMaya.kini)
  const cdp = await konteks.newCDPSession(halaman)
  return { halaman, cdp, spek, sedia, mulaJam, ralatHalaman }
}

utama().catch((e) => {
  lapor('gagal', { mesej: e instanceof Error ? e.message : String(e) })
  process.exit(1)
})
