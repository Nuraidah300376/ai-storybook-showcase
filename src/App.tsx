import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { HalamanMasterPrompt } from './components/HalamanMasterPrompt'
import { pramuatImej } from './components/ImejHalaman'
import { Kredit } from './components/Kredit'
import { LatarSinematik } from './components/LatarSinematik'
import { ModPersembahan } from './components/ModPersembahan'
import { Navbar } from './components/Navbar'
import { PanduanImej } from './components/PanduanImej'
import { PaparanBuku } from './components/PaparanBuku'
import { Pembukaan } from './components/Pembukaan'
import { PengurusHalaman } from './components/pengurus/PengurusHalaman'
import type { Orientasi } from './components/Pentas'
import { SeksyenPersembahan } from './components/SeksyenPersembahan'
import { SeksyenPrompt } from './components/SeksyenPrompt'
import { SeksyenTikTok } from './components/tiktok/SeksyenTikTok'
import { ShowcaseTikTok } from './components/tiktok/ShowcaseTikTok'
import { LALUAN, useHash } from './hooks/useHash'
import { mulakanStor } from './lib/storImej'

export default function App() {
  const hash = useHash()

  // Halaman MASTER PROMPT PENUH juga tersedia melalui #/master-prompt
  // (contohnya dalam pratonton satu fail yang tiada folder prompt/).
  useEffect(() => {
    if (hash === LALUAN.masterPrompt) window.scrollTo(0, 0)
  }, [hash])

  if (hash === LALUAN.masterPrompt) return <HalamanMasterPrompt pautanUtama="#utama" />
  return <AplikasiUtama hash={hash} />
}

function AplikasiUtama({ hash }: { hash: string }) {
  const [persembahan, setPersembahan] = useState<Orientasi | null>(null)
  const [showcase, setShowcase] = useState(hash === LALUAN.showcase)
  const [indeksBuku, setIndeksBuku] = useState(0)

  // Kenal pasti imej halaman lebih awal (fail public/halaman dan imej dimuat naik)
  // supaya animasi selak tidak berkelip.
  useEffect(() => {
    pramuatImej()
    void mulakanStor()
  }, [])

  // Pautan #/showcase membuka TikTok Cinematic Showcase terus.
  useEffect(() => {
    if (hash === LALUAN.showcase) setShowcase(true)
  }, [hash])

  const tutupShowcase = useCallback(() => {
    setShowcase(false)
    if (window.location.hash === LALUAN.showcase) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const lihatDalamBuku = useCallback((indeks: number) => {
    setIndeksBuku(indeks)
    document.getElementById('buku')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <LatarSinematik />
      <Navbar onTikTok={() => setShowcase(true)} />
      <main>
        <Pembukaan onPersembahan={() => setPersembahan('landskap')} onTikTok={() => setShowcase(true)} />
        <PaparanBuku indeks={indeksBuku} setIndeks={setIndeksBuku} />
        <PengurusHalaman onLihatDalamBuku={lihatDalamBuku} />
        <SeksyenTikTok onBuka={() => setShowcase(true)} />
        <SeksyenPersembahan onBuka={setPersembahan} />
        <SeksyenPrompt />
        <PanduanImej />
      </main>
      <Kredit />

      <AnimatePresence>
        {persembahan && <ModPersembahan orientasiAwal={persembahan} onTutup={() => setPersembahan(null)} />}
      </AnimatePresence>
      <AnimatePresence>{showcase && <ShowcaseTikTok onTutup={tutupShowcase} />}</AnimatePresence>
    </>
  )
}
