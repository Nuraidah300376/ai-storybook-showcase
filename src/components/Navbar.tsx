import { motion } from 'motion/react'
import { IkonBuku, IkonTelefon } from './Ikon'

const PAUTAN = [
  { href: '#buku', label: 'Buku' },
  { href: '#persembahan', label: 'Persembahan' },
  { href: '#prompt', label: 'Master Prompt' },
  { href: '#panduan', label: 'Panduan' },
]

export function Navbar({ onTikTok }: { onTikTok: () => void }) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6"
    >
      <nav
        aria-label="Navigasi utama"
        className="kaca mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-4 shadow-lg shadow-black/30"
      >
        <a href="#utama" className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emas-300 to-emas-500 text-navy-950">
            <IkonBuku />
          </span>
          <span className="truncate text-sm">
            AI Storybook <span className="text-emas-300">Showcase</span>
          </span>
        </a>
        <ul className="hidden items-center gap-1 text-sm text-slate-300 md:flex">
          {PAUTAN.map((p) => (
            <li key={p.href}>
              <a href={p.href} className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onTikTok} className="butang-zamrud shrink-0 px-4">
          <IkonTelefon />
          <span className="hidden sm:inline">Mod TikTok 9:16</span>
          <span className="sm:hidden">9:16</span>
        </button>
      </nav>
    </motion.header>
  )
}
