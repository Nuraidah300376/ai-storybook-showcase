import { motion, useReducedMotion } from 'motion/react'

interface Props {
  baris: string[]
  className?: string
  /** Kelewatan sebelum animasi bermula (saat). */
  lewat?: number
}

/** Tajuk yang muncul huruf demi huruf dengan kesan cahaya emas. */
export function TajukAnimasi({ baris, className = '', lewat = 0 }: Props) {
  const kurang = useReducedMotion()
  let kiraan = 0

  return (
    <span className={className} aria-label={baris.join(' ')} role="text">
      {baris.map((b, i) => (
        <span key={i} aria-hidden="true" className="block">
          {b.split(' ').map((perkataan, j, semua) => (
            <span key={j} className="inline-block whitespace-nowrap">
              {[...perkataan].map((huruf, k) => {
                const n = kiraan++
                return (
                  <motion.span
                    key={k}
                    className="teks-emas inline-block"
                    initial={kurang ? false : { opacity: 0, y: '0.5em', rotateX: -70, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                    transition={{ delay: lewat + n * 0.035, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {huruf}
                  </motion.span>
                )
              })}
              {j < semua.length - 1 && <span className="inline-block w-[0.28em]" />}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
