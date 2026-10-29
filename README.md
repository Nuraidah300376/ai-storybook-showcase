# AI Storybook Showcase

Aplikasi web untuk mempersembahkan buku cerita bergambar **Amanah Kecil, Hati Besar**
karya **Nuraidah binti Mustapah**.

> **Pembangun:** Nuraidah binti Mustapah

**Status: Fasa 3** — TikTok Cinematic Showcase 9:16 (60 saat, 1080×1920), halaman MASTER PROMPT PENUH dan kod QR perkongsian.
Fungsi Fasa 1 dan Fasa 2 dikekalkan.

> **Pratonton tanpa Node.js:** muat turun [`pratonton/index.html`](pratonton/index.html) dan klik dua kali.
> Panduan ringkas: [`docs/PANDUAN-PENGGUNA.md`](docs/PANDUAN-PENGGUNA.md).
> Menerbitkan laman master prompt untuk kod QR: [`docs/PANDUAN-GITHUB-PAGES.md`](docs/PANDUAN-GITHUB-PAGES.md).

## Fasa 3 — TikTok Cinematic Showcase

- Mod khas **9:16** pada kawasan asas **1080×1920**, diskalakan untuk muat pada komputer dan telefon. Buka melalui
  butang **Mod TikTok 9:16** atau `#/showcase` pada hujung URL.
- Persembahan **60 saat**:

  | Saat | Kandungan |
  | --- | --- |
  | 0–5 | Hook **SATU PROMPT, SEBUAH BUKU CERITA!** |
  | 5–12 | Kulit hadapan (halaman 1) dengan kamera 3D condong → rata dan sapuan cahaya |
  | 12–35 | Animasi selak 3D halaman 2 hingga 12 dengan zum perlahan |
  | 35–45 | Struktur master prompt |
  | 45–52 | **RANCANG → LULUS → JANA SATU HALAMAN** |
  | 52–60 | Kod QR dan arahan mendapatkan prompt |

- Kawalan **Mula**, **Jeda**, **Ulang**, **Skrin Penuh**, **Sembunyikan Kawalan**, garis masa boleh dilompat dan
  panduan **Zon Selamat** TikTok (semua teks penting berada dalam zon itu).
- 12 ilustrasi asal dalam `public/halaman/` digunakan tanpa diubah; tiada teks ditambah di atas ilustrasi.
- Halaman **MASTER PROMPT PENUH** (`prompt/` atau `#/master-prompt`): teks boleh dipilih, disalin, dimuat turun
  (.txt) dan dibesarkan untuk telefon.
- Master prompt asal dimasukkan dalam [`kandungan/master-prompt.txt`](kandungan/master-prompt.txt) di antara baris penanda.
  Tiada teks draf digunakan; selagi kosong, aplikasi memaparkan **MASTER PROMPT BELUM DIMASUKKAN**.
- Kod QR dijana dalam pelayar daripada URL awam perkongsian prompt (`URL_PERKONGSIAN_PROMPT` dalam
  `src/data/tiktok.ts`, atau ditetapkan dalam aplikasi). Selagi tiada URL sah, showcase memaparkan placeholder
  **BELUM DIKONFIGURASI** — tiada QR palsu dijana.
- Teks struktur prompt, aliran kerja dan penutup boleh disunting dalam `src/data/tiktok.ts`.

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

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · fflate · uqr (kod QR) · Vitest

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

## Pintasan papan kekunci (TikTok Cinematic Showcase)

| Kekunci | Fungsi |
| --- | --- |
| Ruang / K | Mula atau Jeda |
| ← / → | Undur / maju 5 saat |
| R | Ulang dari awal |
| H | Sembunyi / papar kawalan |
| Z | Papar panduan zon selamat |
| F | Skrin penuh |
| Esc | Tutup |

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
kandungan/master-prompt.txt ← TAMPAL MASTER PROMPT ASAL DI SINI
prompt/index.html        ← halaman MASTER PROMPT PENUH (untuk kod QR)
.github/workflows/pages.yml ← terbit ke GitHub Pages (dijalankan manual)
docs/PANDUAN-GITHUB-PAGES.md ← panduan menerbitkan laman perkongsian prompt
public/halaman/          ← letak 12 imej sebenar di sini (simpanan kekal)
pratonton/index.html     ← pratonton satu fail, dibuka tanpa Node.js
docs/PANDUAN-IMEJ.md     ← panduan memasukkan imej dan batasan storan
docs/PANDUAN-PENGGUNA.md ← panduan ringkas pengguna
src/
├── data/buku.ts         ← maklumat buku dan 12 halaman
├── data/masterPrompt.ts ← membaca kandungan/master-prompt.txt
├── data/tiktok.ts       ← tetapan TikTok Showcase: URL QR, zon selamat, teks segmen
├── lib/garisMasa.ts     ← garis masa 60 saat (diuji)
├── lib/qr.ts            ← penjana kod QR (diuji)
├── lib/urlAwam.ts       ← pengesahan URL awam (diuji)
├── components/tiktok/   ← TikTok Cinematic Showcase, kod QR, tetapan QR
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
