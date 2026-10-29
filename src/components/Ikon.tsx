import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Asas({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.15em"
      height="1.15em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  )
}

export const IkonMain = (p: P) => (
  <Asas {...p}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
  </Asas>
)
export const IkonJeda = (p: P) => (
  <Asas {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </Asas>
)
export const IkonUlang = (p: P) => (
  <Asas {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Asas>
)
export const IkonKiri = (p: P) => (
  <Asas {...p}>
    <path d="m15 18-6-6 6-6" />
  </Asas>
)
export const IkonKanan = (p: P) => (
  <Asas {...p}>
    <path d="m9 18 6-6-6-6" />
  </Asas>
)
export const IkonSalin = (p: P) => (
  <Asas {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Asas>
)
export const IkonTanda = (p: P) => (
  <Asas {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Asas>
)
export const IkonTelefon = (p: P) => (
  <Asas {...p}>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </Asas>
)
export const IkonMonitor = (p: P) => (
  <Asas {...p}>
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </Asas>
)
export const IkonTutup = (p: P) => (
  <Asas {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Asas>
)
export const IkonMataTutup = (p: P) => (
  <Asas {...p}>
    <path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Asas>
)
export const IkonSkrinPenuh = (p: P) => (
  <Asas {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
  </Asas>
)
export const IkonBuku = (p: P) => (
  <Asas {...p}>
    <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
  </Asas>
)
export const IkonImej = (p: P) => (
  <Asas {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </Asas>
)
export const IkonBintang = (p: P) => (
  <Asas {...p}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" fill="currentColor" stroke="none" />
  </Asas>
)
export const IkonMuatNaik = (p: P) => (
  <Asas {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5M12 3v12" />
  </Asas>
)
export const IkonMuatTurun = (p: P) => (
  <Asas {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5M12 15V3" />
  </Asas>
)
export const IkonGanti = (p: P) => (
  <Asas {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </Asas>
)
export const IkonMata = (p: P) => (
  <Asas {...p}>
    <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8z" />
    <circle cx="12" cy="12" r="3" />
  </Asas>
)
export const IkonTong = (p: P) => (
  <Asas {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Asas>
)
export const IkonAmaran = (p: P) => (
  <Asas {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Asas>
)
export const IkonPangkalan = (p: P) => (
  <Asas {...p}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
    <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
  </Asas>
)
export const IkonPakej = (p: P) => (
  <Asas {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </Asas>
)
export const IkonQr = (p: P) => (
  <Asas {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
  </Asas>
)
export const IkonGrid = (p: P) => (
  <Asas {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 2.5" />
    <rect x="7" y="6" width="10" height="11" rx="1" />
  </Asas>
)
export const IkonVideo = (p: P) => (
  <Asas {...p}>
    <rect x="2.5" y="5.5" width="13" height="13" rx="2" />
    <path d="M15.5 10l6-3.5v11l-6-3.5z" />
  </Asas>
)
