import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  keadaanAwal,
  kemajuanSlaid,
  pengurangAutoplay,
  type ConfigAutoplay,
  type TindakanAutoplay,
} from '../lib/autoplay'

/** Menjalankan persembahan automatik menggunakan requestAnimationFrame. */
export function useAutoplay(config: ConfigAutoplay) {
  const configRef = useRef(config)
  configRef.current = config

  const [keadaan, hantar] = useReducer(
    (k: typeof keadaanAwal, t: TindakanAutoplay) => pengurangAutoplay(k, t, configRef.current),
    keadaanAwal,
  )

  useEffect(() => {
    if (!keadaan.bermain) return
    let raf = 0
    let sebelum = performance.now()
    const detik = (kini: number) => {
      hantar({ jenis: 'detik', dt: kini - sebelum })
      sebelum = kini
      raf = requestAnimationFrame(detik)
    }
    raf = requestAnimationFrame(detik)
    return () => cancelAnimationFrame(raf)
  }, [keadaan.bermain])

  const kawalan = useMemo(
    () => ({
      mula: () => hantar({ jenis: 'mula' }),
      jeda: () => hantar({ jenis: 'jeda' }),
      ulang: () => hantar({ jenis: 'ulang' }),
      seterusnya: () => hantar({ jenis: 'seterusnya' }),
      sebelumnya: () => hantar({ jenis: 'sebelumnya' }),
      pergi: (indeks: number) => hantar({ jenis: 'pergi', indeks }),
      loncat: (indeks: number, berlalu: number) => hantar({ jenis: 'loncat', indeks, berlalu }),
    }),
    [],
  )

  const kemajuan = kemajuanSlaid(keadaan, config)
  const togol = useCallback(
    () => (keadaan.bermain ? kawalan.jeda() : kawalan.mula()),
    [keadaan.bermain, kawalan],
  )

  return { ...keadaan, kemajuan, ...kawalan, togol }
}
