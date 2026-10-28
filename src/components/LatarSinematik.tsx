import { motion, useReducedMotion } from 'motion/react'

/**
 * Latar belakang sinematik: cahaya lembut navy, emas dan zamrud.
 * Cahaya dilukis dengan kecerunan jejari (bukan penapis blur) supaya
 * pergerakannya murah untuk dilukis semula, terutamanya pada telefon.
 */
export function LatarSinematik() {
  const kurang = useReducedMotion()
  const apung = (x: number, y: number, t: number) =>
    kurang ? undefined : { x: [0, x, 0], y: [0, y, 0], transition: { duration: t, repeat: Infinity, ease: 'easeInOut' as const } }

  return (
    <div aria-hidden="true" className="bijirin pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(33,58,122,0.55),transparent_60%)]" />
      <motion.div
        animate={apung(40, 30, 18)}
        className="absolute -top-72 will-change-transform -left-64 h-[60rem] w-[60rem] bg-[radial-gradient(circle,rgba(201,154,46,0.16),transparent_62%)]"
      />
      <motion.div
        animate={apung(-50, 40, 22)}
        className="absolute top-1/4 will-change-transform -right-72 h-[56rem] w-[56rem] bg-[radial-gradient(circle,rgba(31,163,122,0.16),transparent_62%)]"
      />
      <motion.div
        animate={apung(30, -40, 26)}
        className="absolute -bottom-80 will-change-transform left-[15%] h-[52rem] w-[52rem] bg-[radial-gradient(circle,rgba(33,58,122,0.45),transparent_62%)]"
      />
      <div className="absolute inset-0 will-change-transform bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  )
}
