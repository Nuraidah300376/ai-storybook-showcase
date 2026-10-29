import { useMemo } from 'react'
import { janaMatriksQr, laluanSvgQr } from '../../lib/kodQr'

const ZON_SENYAP = 4

/** Kod QR sebenar (SVG vektor) bagi `teks`, termasuk zon senyap putih. */
export function KodQr({ teks, className = '' }: { teks: string; className?: string }) {
  const { saiz, d } = useMemo(() => {
    const m = janaMatriksQr(teks)
    return { saiz: m.saiz + ZON_SENYAP * 2, d: laluanSvgQr(m, ZON_SENYAP) }
  }, [teks])
  return (
    <svg
      viewBox={`0 0 ${saiz} ${saiz}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Kod QR ke ${teks}`}
    >
      <rect width={saiz} height={saiz} fill="#fff" />
      <path d={d} fill="#0a1430" />
    </svg>
  )
}
