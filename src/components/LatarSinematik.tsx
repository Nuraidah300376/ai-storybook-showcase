import { motion, useReducedMotion } from 'motion/react'

/** Latar belakang sinematik: cahaya lembut navy, emas dan zamrud. */
export function LatarSinematik() {
  const kurang = useReducedMotion()
  const apung = (x: number, y: number, t: number) =>
    kurang ? undefined : { x: [0, x, 0], y: [0, y, 0], transition: { duration: t, repeat: Infinity, ease: 'easeInOut' as const } }

  return (
    <div aria-hidden="true" className="bijirin pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(33,58,122,0.55),transparent_60%)]" />
      <motion.div
        animate={apung(40, 30, 18)}
        className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-emas-500/15 blur-[120px]"
      />
      <motion.div
        animate={apung(-50, 40, 22)}
        className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-zamrud-500/15 blur-[120px]"
      />
      <motion.div
        animate={apung(30, -40, 26)}
        className="absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full bg-navy-600/40 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  )
}
