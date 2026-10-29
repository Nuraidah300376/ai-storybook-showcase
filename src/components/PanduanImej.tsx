import { motion } from 'motion/react'
import { KepalaSeksyen } from './KepalaSeksyen'

const CARA_PANTAS = [
  {
    tajuk: 'Sediakan 12 imej',
    isi: 'Setiap imej ialah satu halaman penuh berukuran A5 potret (148 × 210 mm), contohnya 1748 × 2480 piksel. Ilustrasi dan teks cerita kekal seperti asal.',
  },
  {
    tajuk: 'Namakan fail',
    isi: (
      <>
        Gunakan <code>halaman-01</code> hingga <code>halaman-12</code> dengan sambungan <code>.png</code>, <code>.jpg</code>,{' '}
        <code>.jpeg</code> atau <code>.webp</code>. Nombor dalam nama menentukan susunan halaman.
      </>
    ),
  },
  {
    tajuk: 'Muat naik',
    isi: (
      <>
        Di <a href="#pengurus">Pengurus Halaman Buku</a>, tekan <strong>Pilih Imej</strong> dan pilih semua 12 fail, atau seret dan
        lepas. Placeholder diganti serta-merta.
      </>
    ),
  },
  {
    tajuk: 'Eksport sandaran',
    isi: (
      <>
        Tekan <strong>Eksport Pakej</strong> untuk memuat turun fail ZIP. Gunakan <strong>Import Pakej</strong> untuk memulihkannya
        pada pelayar atau peranti lain.
      </>
    ),
  },
]

const CARA_KEKAL = [
  <>
    Tekan <strong>Eksport Pakej</strong> dan nyahzip fail <code>amanah-kecil-hati-besar-halaman.zip</code>. Folder{' '}
    <code>halaman/</code> di dalamnya sudah mengandungi fail bernama betul.
  </>,
  <>
    Di GitHub, buka repositori dan masuk ke folder <code>public/halaman</code>.
  </>,
  <>
    Tekan <strong>Add file → Upload files</strong>, seret semua 12 imej, kemudian tekan <strong>Commit changes</strong>.
  </>,
  <>
    Bina dan terbitkan semula aplikasi. Semua penonton kini melihat imej yang sama, pada mana-mana peranti.
  </>,
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
        huraian="Dua cara: muat naik terus dalam aplikasi (disimpan dalam pelayar ini), atau simpan secara kekal dalam folder public/halaman supaya semua penonton melihatnya."
      />

      <h3 className="mx-auto mb-4 max-w-5xl font-semibold text-emas-300">Cara 1 · Pengurus Halaman Buku (pantas)</h3>
      <ol className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARA_PANTAS.map((l, i) => (
          <motion.li
            key={l.tajuk}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="kaca rounded-2xl p-6 [&_a]:text-emas-200 [&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:text-emas-200 [&_strong]:text-white"
          >
            <span className="font-display text-4xl font-bold text-emas-400/80">{i + 1}</span>
            <h4 className="mt-3 font-semibold text-white">{l.tajuk}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{l.isi}</p>
          </motion.li>
        ))}
      </ol>

      <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-emas-400/25 bg-emas-400/5 p-4 text-sm text-slate-300">
        Cara 1 menyimpan imej dalam <strong className="text-white">storan pelayar ini sahaja</strong>. Imej tidak dihantar ke GitHub
        atau ke pelayan, dan tidak dilihat oleh penonton lain.
      </div>

      <h3 className="mx-auto mt-12 mb-4 max-w-5xl font-semibold text-zamrud-300">Cara 2 · Simpan secara kekal dalam public/halaman</h3>
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        <ol className="kaca list-none space-y-3 rounded-2xl p-6 text-sm text-slate-400 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:text-emas-200 [&_strong]:text-white">
          {CARA_KEKAL.map((isi, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-zamrud-500/20 text-xs font-bold text-zamrud-300">
                {i + 1}
              </span>
              <span className="leading-relaxed">{isi}</span>
            </li>
          ))}
        </ol>
        <div className="kaca min-w-0 rounded-2xl p-6">
          <p className="text-sm font-semibold text-zamrud-300">Struktur folder</p>
          <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-slate-300 sm:text-sm">{`public/
└── halaman/
    ├── halaman-01.png
    ├── halaman-02.png
    ├── …
    └── halaman-12.png`}</pre>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 [&_code]:text-emas-200">
            Jika satu halaman mempunyai fail dalam <code>public/halaman</code> dan juga imej yang dimuat naik, imej yang dimuat
            naik dipaparkan dahulu. Buang muat naik untuk kembali ke fail kekal.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 [&_code]:text-emas-200">
            Panduan penuh: <code>docs/PANDUAN-IMEJ.md</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
