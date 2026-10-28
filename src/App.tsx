import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
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
import { mulakanStor } from './lib/storImej'

export default function App() {
  const [persembahan, setPersembahan] = useState<Orientasi | null>(null)
  const [indeksBuku, setIndeksBuku] = useState(0)

  // Kenal pasti imej halaman lebih awal (fail public/halaman dan imej dimuat naik)
  // supaya animasi selak tidak berkelip.
  useEffect(() => {
    pramuatImej()
    void mulakanStor()
  }, [])

  const lihatDalamBuku = useCallback((indeks: number) => {
    setIndeksBuku(indeks)
    document.getElementById('buku')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <LatarSinematik />
      <Navbar onTikTok={() => setPersembahan('menegak')} />
      <main>
        <Pembukaan onPersembahan={() => setPersembahan('landskap')} onTikTok={() => setPersembahan('menegak')} />
        <PaparanBuku indeks={indeksBuku} setIndeks={setIndeksBuku} />
        <PengurusHalaman onLihatDalamBuku={lihatDalamBuku} />
        <SeksyenPersembahan onBuka={setPersembahan} />
        <SeksyenPrompt />
        <PanduanImej />
      </main>
      <Kredit />

      <AnimatePresence>
        {persembahan && <ModPersembahan orientasiAwal={persembahan} onTutup={() => setPersembahan(null)} />}
      </AnimatePresence>
    </>
  )
}
