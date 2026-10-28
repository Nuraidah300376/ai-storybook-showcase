import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { Kredit } from './components/Kredit'
import { LatarSinematik } from './components/LatarSinematik'
import { ModPersembahan } from './components/ModPersembahan'
import { Navbar } from './components/Navbar'
import { PanduanImej } from './components/PanduanImej'
import { PaparanBuku } from './components/PaparanBuku'
import { Pembukaan } from './components/Pembukaan'
import type { Orientasi } from './components/Pentas'
import { SeksyenPersembahan } from './components/SeksyenPersembahan'
import { SeksyenPrompt } from './components/SeksyenPrompt'

export default function App() {
  const [persembahan, setPersembahan] = useState<Orientasi | null>(null)

  return (
    <>
      <LatarSinematik />
      <Navbar onTikTok={() => setPersembahan('menegak')} />
      <main>
        <Pembukaan onPersembahan={() => setPersembahan('landskap')} onTikTok={() => setPersembahan('menegak')} />
        <PaparanBuku />
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
