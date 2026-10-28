# AI Storybook Showcase

Aplikasi web untuk mempersembahkan buku cerita bergambar **Amanah Kecil, Hati Besar**
karya **Nuraidah binti Mustapah**.

> **Pembangun:** Nuraidah binti Mustapah

**Status: Fasa 1** — struktur dan reka bentuk aplikasi. Imej halaman masih menggunakan placeholder berlabel.

## Ciri-ciri

- Halaman pembukaan dengan animasi tajuk **SATU PROMPT, SEBUAH BUKU CERITA!**
- Paparan buku interaktif 12 halaman dengan **animasi selak halaman 3D**:
  - komputer dan 16:9: buku terbuka dua muka (ilustrasi kiri, teks kanan), helaian berpusing di tulang tengah;
  - telefon, tablet dan 9:16: halaman tunggal diselak dari tulang kiri;
  - navigasi dengan butang Sebelumnya/Seterusnya, kekunci anak panah, ketik di tepi halaman, leretan sentuh dan lakaran kecil;
  - klik berulang tidak bertindih: selakan semasa dipercepat, kemudian buku terus ke halaman sasaran.
- Mod persembahan automatik dengan kawalan **Mula**, **Jeda** dan **Ulang**; setiap pertukaran halaman diselak, bermula dari halaman judul, dengan zum perlahan.
- Mod paparan menegak **9:16** untuk rakaman TikTok (serta landskap 16:9), skrin penuh dan pilihan menyembunyikan kawalan.
- Bahagian perkongsian master prompt dengan butang **Salin Prompt**.
- Panduan memasukkan 12 imej sebenar (`docs/PANDUAN-IMEJ.md`).
- Responsif untuk komputer, tablet dan telefon pintar.
- Berjalan sepenuhnya di pelayar — tiada API berbayar, tiada kunci API, fon disertakan secara setempat.

> Aplikasi ini **tidak** mempunyai fungsi eksport video. Untuk menghasilkan video TikTok,
> gunakan perakam skrin pada telefon atau komputer semasa mod persembahan 9:16 dimainkan.

## Teknologi

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Vitest

## Cara menjalankan

Keperluan: Node.js 20 atau lebih baharu.

```bash
npm install
npm run dev        # pratonton pembangunan di http://localhost:5173
```

Arahan lain:

```bash
npm run semak      # semakan jenis TypeScript
npm run ujian      # ujian unit
npm run build      # binaan produksi ke folder dist/
npm run preview    # pratonton hasil binaan di http://localhost:4173
```

## Pintasan papan kekunci (mod persembahan)

| Kekunci | Fungsi |
| --- | --- |
| Ruang / K | Mula atau Jeda |
| ← / → | Slaid sebelumnya / seterusnya |
| R | Ulang dari awal |
| H | Sembunyi / papar kawalan |
| F | Skrin penuh |
| Esc | Tutup |

## Struktur projek

```
public/halaman/          ← letak 12 imej sebenar di sini
docs/PANDUAN-IMEJ.md     ← panduan memasukkan imej
src/
├── data/buku.ts         ← maklumat buku, 12 halaman, teks
├── data/masterPrompt.ts ← master prompt (kini templat draf)
├── data/slaid.ts        ← urutan dan tempoh slaid persembahan
├── lib/autoplay.ts      ← logik persembahan automatik (diuji)
├── lib/selak.ts         ← logik susunan muka animasi selak (diuji)
├── components/buku/     ← buku selak 3D dan muka halaman
└── components/          ← komponen antara muka
```
