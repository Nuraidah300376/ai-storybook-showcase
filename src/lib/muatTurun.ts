interface SimpanFail {
  save(req: { filename: string; data: Blob }): Promise<unknown>
}

/** Penyimpan fail daripada hos Claude Artifact, jika halaman dibuka di sana. */
async function penyimpanArtifact(): Promise<SimpanFail | null> {
  const claude = (window as { claude?: { use?: (nama: string) => Promise<unknown> } }).claude
  if (typeof claude?.use !== 'function') return null
  try {
    return ((await claude.use('downloads')) as SimpanFail | null) ?? null
  } catch {
    return null
  }
}

/**
 * Muat turun Blob sebagai fail. Dalam Claude Artifact, muat turun terus
 * disekat; fail ditawarkan melalui kapasiti `downloads` (pengguna mengesahkan).
 */
export async function muatTurun(blob: Blob, nama: string): Promise<'disimpan' | 'ditolak' | 'gagal'> {
  const penyimpan = await penyimpanArtifact()
  if (penyimpan) {
    try {
      await penyimpan.save({ filename: nama, data: blob })
      return 'disimpan'
    } catch (e) {
      return (e as { code?: string })?.code === 'declined' ? 'ditolak' : 'gagal'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nama
  document.body.append(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
  return 'disimpan'
}
