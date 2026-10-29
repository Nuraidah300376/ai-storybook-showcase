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
import { PersembahanTikTok } from './components/tiktok/PersembahanTikTok'
import { mulakanStor } from './lib/storImej'

export default function App() {
  const [persembahan, setPersembahan] = useState<Orientasi | null>(null)
  const [indeksBuku, setIndeksBuku] = useState(0)
  // Pautan terus #tiktok-60 membuka persembahan TikTok 60 saat.
  const [tiktok60, setTiktok60] = useState(() => window.location.hash === '#tiktok-60')

  // Kenal pasti imej halaman lebih awal (fail public/halaman dan imej dimuat naik)
  // supaya animasi selak tidak berkelip.
  useEffect(() => {
    void pramuatImej()
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
        <Pembukaan
          onPersembahan={() => setPersembahan('landskap')}
          onTikTok={() => setPersembahan('menegak')}
          onTikTok60={() => setTiktok60(true)}
        />
        <PaparanBuku indeks={indeksBuku} setIndeks={setIndeksBuku} />
        <PengurusHalaman onLihatDalamBuku={lihatDalamBuku} />
        <SeksyenPersembahan onBuka={setPersembahan} onTikTok60={() => setTiktok60(true)} />
        <SeksyenPrompt />
        <PanduanImej />
      </main>
      <Kredit />

      <AnimatePresence>
        {persembahan && <ModPersembahan orientasiAwal={persembahan} onTutup={() => setPersembahan(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {tiktok60 && (
          <PersembahanTikTok
            onTutup={() => {
              setTiktok60(false)
              if (window.location.hash === '#tiktok-60') history.replaceState(null, '', window.location.pathname + window.location.search)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
