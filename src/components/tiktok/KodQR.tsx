import { useMemo } from 'react'
import { janaQR } from '../../lib/qr'

interface Props {
  /** URL awam yang sah, atau null jika belum dikonfigurasi. */
  url: string | null
  /** Saiz sisi dalam piksel (atau sebarang nilai CSS). */
  saiz: number | string
  className?: string
}

/**
 * Kod QR sebenar bagi URL perkongsian prompt. Jika tiada URL sah, paparkan
 * placeholder berlabel BELUM DIKONFIGURASI — tiada corak QR palsu dilukis.
 */
export function KodQR({ url, saiz, className = '' }: Props) {
  const qr = useMemo(() => (url ? janaQR(url) : null), [url])

  if (!qr) {
    return (
      <div
        role="img"
        aria-label="Kod QR belum dikonfigurasi"
        style={{ width: saiz, height: saiz }}
        className={`@container relative grid place-items-center rounded-[6%] border-[0.6cqw] border-dashed border-emas-400/70 bg-navy-900/80 text-center ${className}`}
      >
        <div className="flex flex-col items-center gap-[4cqw] px-[8cqw]">
          <svg viewBox="0 0 24 24" className="size-[22cqw] text-emas-300/80" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
            <path d="M12 8v5M12 16.5v.01" strokeLinecap="round" />
          </svg>
          <p className="text-[9cqw] leading-tight font-bold tracking-wide text-emas-200">
            BELUM
            <br />
            DIKONFIGURASI
          </p>
          <p className="text-[4.6cqw] leading-snug text-slate-300">Kod QR dijana selepas URL awam perkongsian prompt ditetapkan</p>
        </div>
      </div>
    )
  }

  return (
    <svg
      role="img"
      aria-label={`Kod QR ke ${url}`}
      viewBox={`0 0 ${qr.saiz} ${qr.saiz}`}
      style={{ width: saiz, height: saiz }}
      shapeRendering="crispEdges"
      className={`rounded-[4%] ${className}`}
    >
      <rect width={qr.saiz} height={qr.saiz} fill="#fff" />
      <path d={qr.laluan} fill="#050a18" />
    </svg>
  )
}
