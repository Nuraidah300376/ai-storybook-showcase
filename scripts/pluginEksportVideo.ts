/**
 * Pemalam Vite: API eksport video MP4 untuk butang "EKSPORT VIDEO MP4" (Fasa 4).
 *
 * Aktif hanya pada pelayan tempatan (`npm run dev`, `npm run preview` atau
 * `npm run eksport:pelayan`). Pelayan menjalankan scripts/eksport-video.mjs
 * (Chromium tanpa kepala + FFmpeg), kemudian scripts/semak-video.mjs. Fail MP4
 * hanya ditawarkan untuk dimuat turun selepas semakan lulus.
 *
 *   GET  /api/eksport-video                 → { tersedia, ffmpeg, tugas }
 *   POST /api/eksport-video                 → mula tugas (badan: MuatanEksport JSON)
 *   GET  /api/eksport-video/tugas/:id       → status tugas
 *   GET  /api/eksport-video/tugas/:id/fail  → muat turun MP4
 *   POST /api/eksport-video/tugas/:id/batal → hentikan tugas
 */
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

export const LALUAN_API = '/api/eksport-video'
const HAD_MUATAN = 150 * 1024 * 1024

type Keadaan = 'berjalan' | 'berjaya' | 'gagal' | 'dibatalkan'

interface Tugas {
  id: string
  keadaan: Keadaan
  fasa: string
  bingkai: number
  jumlah: number
  dimulakan: number
  tamat?: number
  mesej?: string
  fail?: string
  namaFail?: string
  saizBait?: number
  semakan?: { nama: string; lulus: boolean; butiran: string }[]
  proses?: ChildProcess
}

function awam(t: Tugas) {
  const { proses: _, fail: __, ...lain } = t
  return lain
}

function json(res: ServerResponse, kod: number, data: unknown) {
  res.statusCode = kod
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

function bacaBadan(req: IncomingMessage): Promise<string> {
  return new Promise((lulus, gagal) => {
    const bahagian: Buffer[] = []
    let saiz = 0
    req.on('data', (d: Buffer) => {
      saiz += d.length
      if (saiz > HAD_MUATAN) {
        gagal(new Error('Muatan terlalu besar.'))
        req.destroy()
      } else bahagian.push(d)
    })
    req.on('end', () => lulus(Buffer.concat(bahagian).toString('utf8')))
    req.on('error', gagal)
  })
}

/** Baris JSON daripada stdout proses anak. */
function bacaBaris(p: ChildProcess, kendali: (o: Record<string, unknown>) => void) {
  let baki = ''
  p.stdout?.on('data', (d: Buffer) => {
    baki += d.toString()
    const baris = baki.split('\n')
    baki = baris.pop() ?? ''
    for (const b of baris) {
      try {
        kendali(JSON.parse(b))
      } catch {
        // Bukan JSON: abaikan.
      }
    }
  })
}

export function pluginEksportVideo(): Plugin {
  let akar = process.cwd()
  let tugas: Tugas | null = null
  let ffmpegAda: boolean | null = null

  const adaFfmpeg = () => {
    ffmpegAda ??= spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0
    return ffmpegAda
  }

  function mula(muatan: string, urlAsas: string): Tugas {
    const id = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
    const folder = join(akar, 'eksport')
    mkdirSync(folder, { recursive: true })
    const failMuatan = join(folder, `.muatan-${id}.json`)
    writeFileSync(failMuatan, muatan)
    const namaFail = `tiktok-60s-${id}.mp4`
    const fail = join(folder, namaFail)
    const t: Tugas = { id, keadaan: 'berjalan', fasa: 'Memulakan', bingkai: 0, jumlah: 1800, dimulakan: Date.now(), fail, namaFail }

    const selesai = (keadaan: Keadaan, mesej?: string) => {
      if (t.keadaan !== 'berjalan') return
      t.keadaan = keadaan
      t.mesej = mesej
      t.tamat = Date.now()
      t.proses = undefined
    }

    const p = spawn(
      process.execPath,
      [join(akar, 'scripts/eksport-video.mjs'), '--url', urlAsas, '--data', failMuatan, '--keluaran', fail, '--json'],
      { cwd: akar, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    t.proses = p
    let ralat = ''
    p.stderr?.on('data', (d: Buffer) => (ralat = (ralat + d.toString()).slice(-2000)))
    bacaBaris(p, (o) => {
      if (o.jenis === 'kemajuan') {
        t.bingkai = Number(o.bingkai)
        t.jumlah = Number(o.jumlah)
        t.fasa = 'Memaparkan bingkai'
      } else if (o.jenis === 'fasa') t.fasa = String(o.teks)
      else if (o.jenis === 'gagal') t.mesej = String(o.mesej)
    })
    p.on('error', (e) => selesai('gagal', `Pemapar tidak dapat dijalankan: ${e.message}`))
    p.on('close', (kod) => {
      rmSync(failMuatan, { force: true })
      if (t.keadaan !== 'berjalan') return
      if (kod !== 0 || !existsSync(fail)) {
        selesai('gagal', t.mesej || ralat.trim().split('\n').slice(-3).join(' ') || `Pemapar keluar dengan kod ${kod}.`)
        return
      }
      t.fasa = 'Menyemak MP4 (codec, resolusi, fps, durasi, animasi, kod QR)'
      const s = spawn(process.execPath, [join(akar, 'scripts/semak-video.mjs'), fail, '--json'], { cwd: akar, stdio: ['ignore', 'pipe', 'pipe'] })
      t.proses = s
      bacaBaris(s, (o) => {
        if (Array.isArray(o.keputusan)) t.semakan = o.keputusan as Tugas['semakan']
        if (o.ralat) t.mesej = String(o.ralat)
      })
      s.on('close', (k) => {
        if (k === 0) {
          t.saizBait = statSync(fail).size
          t.fasa = 'Siap'
          selesai('berjaya')
        } else {
          const gagal = t.semakan?.filter((x) => !x.lulus).map((x) => x.nama)
          selesai('gagal', t.mesej || `Semakan MP4 gagal: ${gagal?.join(', ') || 'tidak diketahui'}.`)
        }
      })
    })
    return t
  }

  const pengendali = async (req: IncomingMessage, res: ServerResponse, seterusnya: () => void) => {
    const url = new URL(req.url ?? '/', 'http://x')
    if (!url.pathname.startsWith(LALUAN_API)) return seterusnya()
    const laluan = url.pathname.slice(LALUAN_API.length)
    try {
      if (laluan === '' && req.method === 'GET') {
        return json(res, 200, { tersedia: true, ffmpeg: adaFfmpeg(), tugas: tugas && awam(tugas) })
      }
      if (laluan === '' && req.method === 'POST') {
        if (tugas?.keadaan === 'berjalan') return json(res, 409, { mesej: 'Eksport lain sedang berjalan.', tugas: awam(tugas) })
        if (!adaFfmpeg()) return json(res, 500, { mesej: 'FFmpeg tidak ditemui pada komputer ini. Pasang FFmpeg dahulu.' })
        const badan = await bacaBadan(req)
        JSON.parse(badan) // pastikan JSON sah
        // Pemapar membuka aplikasi pada pelayan yang sama (pengguna yang sama, mesin yang sama).
        const urlAsas = `http://${req.headers.host ?? 'localhost'}/`
        tugas = mula(badan, urlAsas)
        return json(res, 202, awam(tugas))
      }
      const padan = /^\/tugas\/([\w-]+)(\/fail|\/batal)?$/.exec(laluan)
      if (padan && tugas && padan[1] === tugas.id) {
        if (!padan[2] && req.method === 'GET') return json(res, 200, awam(tugas))
        if (padan[2] === '/batal' && req.method === 'POST') {
          tugas.proses?.kill()
          if (tugas.keadaan === 'berjalan') Object.assign(tugas, { keadaan: 'dibatalkan', mesej: 'Eksport dibatalkan.', tamat: Date.now() })
          return json(res, 200, awam(tugas))
        }
        if (padan[2] === '/fail' && req.method === 'GET') {
          if (tugas.keadaan !== 'berjaya' || !tugas.fail || !existsSync(tugas.fail)) return json(res, 404, { mesej: 'Fail belum siap.' })
          res.statusCode = 200
          res.setHeader('Content-Type', 'video/mp4')
          res.setHeader('Content-Length', String(statSync(tugas.fail).size))
          res.setHeader('Content-Disposition', `attachment; filename="${tugas.namaFail}"`)
          createReadStream(tugas.fail).pipe(res)
          return
        }
      }
      return json(res, 404, { mesej: 'Tidak ditemui.' })
    } catch (e) {
      return json(res, 400, { mesej: e instanceof Error ? e.message : String(e) })
    }
  }

  return {
    name: 'eksport-video-tiktok',
    configResolved(c) {
      akar = resolve(c.root)
    },
    configureServer(s) {
      s.middlewares.use((req, res, next) => void pengendali(req, res, next))
    },
    configurePreviewServer(s) {
      s.middlewares.use((req, res, next) => void pengendali(req, res, next))
    },
  }
}
