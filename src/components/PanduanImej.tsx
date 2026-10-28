import { motion } from 'motion/react'
import { KepalaSeksyen } from './KepalaSeksyen'

const LANGKAH = [
  {
    tajuk: 'Sediakan 12 imej',
    isi: 'Eksport setiap halaman buku sebagai fail imej. Disyorkan nisbah 4:3, lebar sekitar 1600 piksel, format WebP atau JPG.',
  },
  {
    tajuk: 'Namakan fail',
    isi: (
      <>
        Gunakan nama <code>halaman-01</code> hingga <code>halaman-12</code> dengan sambungan <code>.webp</code>,{' '}
        <code>.jpg</code>, <code>.jpeg</code> atau <code>.png</code>.
      </>
    ),
  },
  {
    tajuk: 'Letakkan dalam folder',
    isi: (
      <>
        Salin semua fail ke folder <code>public/halaman/</code> dalam projek ini.
      </>
    ),
  },
  {
    tajuk: 'Muat semula aplikasi',
    isi: 'Imej dikesan secara automatik dan menggantikan placeholder. Tiada kod perlu diubah.',
  },
]

export function PanduanImej() {
  return (
    <section id="panduan" aria-labelledby="tajuk-panduan" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <KepalaSeksyen
        id="tajuk-panduan"
        label="Panduan"
        tajuk={
          <>
            Memasukkan <span className="teks-emas">12 imej sebenar</span>
          </>
        }
        huraian="Buat masa ini setiap halaman memaparkan placeholder berlabel. Ikuti langkah berikut untuk memasukkan ilustrasi sebenar."
      />

      <ol className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LANGKAH.map((l, i) => (
          <motion.li
            key={l.tajuk}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="kaca rounded-2xl p-6 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:text-emas-200"
          >
            <span className="font-display text-4xl font-bold text-emas-400/80">{i + 1}</span>
            <h3 className="mt-3 font-semibold text-white">{l.tajuk}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{l.isi}</p>
          </motion.li>
        ))}
      </ol>

      <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
        <div className="kaca rounded-2xl p-6">
          <p className="text-sm font-semibold text-zamrud-300">Struktur folder</p>
          <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-slate-300 sm:text-sm">{`public/
└── halaman/
    ├── halaman-01.webp
    ├── halaman-02.webp
    ├── …
    └── halaman-12.webp`}</pre>
        </div>
        <div className="kaca rounded-2xl p-6 text-sm text-slate-400 [&_code]:text-emas-200">
          <p className="font-semibold text-zamrud-300">Teks cerita (pilihan)</p>
          <p className="mt-3 leading-relaxed">
            Masukkan teks setiap halaman dalam medan <code>teks</code> di <code>src/data/buku.ts</code>. Master prompt
            sebenar boleh dikemas kini dalam <code>src/data/masterPrompt.ts</code>.
          </p>
          <p className="mt-3 leading-relaxed">
            Panduan penuh: <code>docs/PANDUAN-IMEJ.md</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
