# AI Storybook Showcase

Aplikasi web untuk mempersembahkan buku cerita bergambar **Amanah Kecil, Hati Besar**
karya **Nuraidah binti Mustapah**.

> **Pembangun:** Nuraidah binti Mustapah

**Status: Fasa 2** — Pengurus Halaman Buku: muat naik, ganti, pratonton, eksport dan import 12 imej halaman A5 terus dalam aplikasi.

> **Pratonton tanpa Node.js:** muat turun [`pratonton/index.html`](pratonton/index.html) dan klik dua kali.
> Panduan ringkas: [`docs/PANDUAN-PENGGUNA.md`](docs/PANDUAN-PENGGUNA.md).

## Ciri-ciri

- Halaman pembukaan dengan animasi tajuk **SATU PROMPT, SEBUAH BUKU CERITA!**
- **Pengurus Halaman Buku** (Fasa 2):
  - 12 slot berlabel Halaman 01 hingga Halaman 12 dengan butang **Muat Naik / Ganti Gambar**, **Pratonton** dan buang;
  - muat naik berbilang fail (PNG, JPG, JPEG, WebP), seret dan lepas, disusun automatik mengikut nombor nama fail;
  - imej menggantikan placeholder serta-merta di buku, lakaran kecil dan mod persembahan;
  - **Eksport Pakej** / **Import Pakej** (ZIP: imej asal + `konfigurasi.json`);
  - imej disimpan dalam **storan pelayar (IndexedDB) pada peranti itu sahaja** — tidak dihantar ke pelayan
    dan tidak disimpan ke GitHub secara automatik. Lihat batasannya dalam [`docs/PANDUAN-IMEJ.md`](docs/PANDUAN-IMEJ.md).
- Paparan buku interaktif 12 halaman A5 potret dengan **animasi selak halaman 3D**. Setiap halaman ialah satu imej
  penuh (ilustrasi dan teks sudah dalam imej), dipaparkan tanpa dipotong dan tanpa teks tambahan:
  - komputer dan 16:9: buku terbuka dua halaman (1–2, 3–4, …), helaian berpusing di tulang tengah;
  - telefon, tablet dan 9:16: halaman tunggal diselak dari tulang kiri;
  - navigasi dengan butang Sebelumnya/Seterusnya, kekunci anak panah, ketik di tepi halaman, leretan sentuh dan lakaran kecil;
  - klik berulang tidak bertindih: selakan semasa dipercepat, kemudian buku terus ke halaman sasaran.
- Mod persembahan automatik dengan kawalan **Mula**, **Jeda** dan **Ulang**; setiap pertukaran halaman diselak, bermula dari halaman judul, dengan zum perlahan.
- Mod paparan menegak **9:16** untuk rakaman TikTok (serta landskap 16:9), skrin penuh dan pilihan menyembunyikan kawalan.
- Bahagian perkongsian master prompt dengan butang **Salin Prompt**.
- Panduan memasukkan 12 imej sebenar (`docs/PANDUAN-IMEJ.md`) dan simpanan kekal dalam `public/halaman/`.
- Responsif untuk komputer, tablet dan telefon pintar.
- Berjalan sepenuhnya di pelayar — tiada API berbayar, tiada kunci API, fon disertakan secara setempat.

> Aplikasi ini **tidak** mempunyai fungsi eksport video. Untuk menghasilkan video TikTok,
> gunakan perakam skrin pada telefon atau komputer semasa mod persembahan 9:16 dimainkan.

## Teknologi

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · fflate · Vitest

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
npm run binaan:pratonton  # satu fail HTML lengkap ke pratonton/index.html (dibuka tanpa Node.js)
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
public/halaman/          ← letak 12 imej sebenar di sini (simpanan kekal)
pratonton/index.html     ← pratonton satu fail, dibuka tanpa Node.js
docs/PANDUAN-IMEJ.md     ← panduan memasukkan imej dan batasan storan
docs/PANDUAN-PENGGUNA.md ← panduan ringkas pengguna
src/
├── data/buku.ts         ← maklumat buku dan 12 halaman
├── data/masterPrompt.ts ← master prompt (kini templat draf)
├── data/slaid.ts        ← urutan dan tempoh slaid persembahan
├── lib/autoplay.ts      ← logik persembahan automatik (diuji)
├── lib/selak.ts         ← logik susunan muka animasi selak (diuji)
├── lib/susunFail.ts     ← pengesahan dan susunan fail mengikut nombor (diuji)
├── lib/pakej.ts         ← eksport/import pakej ZIP (diuji)
├── lib/storImej.ts      ← storan imej IndexedDB / sesi
├── components/pengurus/ ← Pengurus Halaman Buku
├── components/buku/     ← buku selak 3D dan muka halaman
└── components/          ← komponen antara muka
```
