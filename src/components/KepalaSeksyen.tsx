import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  tajuk: ReactNode
  huraian?: ReactNode
}

export function KepalaSeksyen({ id, label, tajuk, huraian }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
    >
      <p className="label-seksyen mb-4 justify-center">{label}</p>
      <h2 id={id} className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        {tajuk}
      </h2>
      {huraian && <p className="mt-4 text-base text-slate-400 sm:text-lg">{huraian}</p>}
    </motion.header>
  )
}
