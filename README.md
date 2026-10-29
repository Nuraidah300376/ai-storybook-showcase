# AI Storybook Showcase

Aplikasi web untuk mempersembahkan buku cerita bergambar **Amanah Kecil, Hati Besar**
karya **Nuraidah binti Mustapah**.

> **Pembangun:** Nuraidah binti Mustapah

**Status: Fasa 4** — Eksport persembahan TikTok 60 saat terus kepada **video MP4** (1080×1920, 9:16, 30 fps, 60 saat),
tanpa perakam skrin. Panduan langkah demi langkah: [`docs/PANDUAN-EKSPORT-VIDEO.md`](docs/PANDUAN-EKSPORT-VIDEO.md).

> **Pratonton tanpa Node.js:** muat turun [`pratonton/index.html`](pratonton/index.html) dan klik dua kali.
> Panduan ringkas: [`docs/PANDUAN-PENGGUNA.md`](docs/PANDUAN-PENGGUNA.md).

## Ciri-ciri

- **Eksport Video MP4** (Fasa 4) — butang **Eksport MP4** dalam mod TikTok 60 Saat:
  - MP4 H.264 (yuv420p), 1080×1920, 9:16, 30 fps, tepat 60 saat (1800 bingkai), tanpa audio melainkan trek audio diberi;
  - **pemaparan bingkai demi bingkai yang deterministik**: halaman `#render-tiktok` dilukis dalam Chromium tanpa kepala
    dengan jam maya, kemudian dikod oleh FFmpeg — animasi selak 3D sebenar, bukan imej statik atau rakaman skrin;
  - bersih: tiada bar pelayar, kawalan, kursor atau ruang hitam; kod QR sebenar kekal boleh diimbas;
  - indikator kemajuan (bingkai, peratus, baki masa), status berjaya/gagal dan butang **Muat Turun MP4**;
  - setiap fail **disemak automatik** (codec, resolusi, fps, durasi, bilangan bingkai, animasi, tepi hitam, imbasan QR)
    sebelum ditawarkan;
  - dua cara sebenar: **GitHub Actions** (*Actions → Eksport Video TikTok → Run workflow*, MP4 sebagai artifak) atau
    **butang satu klik** di komputer sendiri (`npm run eksport:pelayan`). Pada laman statik/Claude Artifact, butang itu
    menerangkan sekatan dan menunjukkan cara-cara ini — bukan butang palsu.
- Halaman pembukaan dengan animasi tajuk **SATU PROMPT, SEBUAH BUKU CERITA!**
- **Persembahan TikTok 60 saat** (Fasa 3) — butang *TikTok 60 Saat: Master Prompt* atau pautan terus `#tiktok-60`:
  - format menegak 9:16 pada asas 1080×1920, diskala supaya muat di komputer dan telefon;
  - susunan: hook *SATU PROMPT, SEBUAH BUKU CERITA!* (0–5 s) → kulit hadapan (5–12 s) → 12 halaman dengan
    animasi selak 3D sebenar (12–35 s) → 4 kelebihan master prompt (35–45 s) → RANCANG → LULUS → JANA SATU HALAMAN
    (45–52 s) → kod QR dan kredit (52–60 s);
  - kapsyen ringkas setiap adegan, semua teks dalam kawasan selamat TikTok (butang **G** memaparkan panduan kawasan selamat);
  - kod QR **sebenar** dijana daripada pautan GitHub master prompt (diuji boleh diimbas), dan boleh diganti dengan imej
    PNG/JPG sendiri melalui butang QR — imej disemak dengan pembaca QR sebelum digunakan;
  - kawalan Mula, Jeda, Ulang, lompat bahagian, Skrin Penuh, sembunyi kawalan dan **Rakam Bersih**
    (kawalan disembunyikan, persembahan bermula dari 0:00 selepas 2 saat);
  - kelebihan dan langkah dipetik daripada master prompt asal `prompts/MASTER-PROMPT-BUKU-CERITA.md`.
- Bahagian **Kongsi Master Prompt** kini memaparkan dan menyalin master prompt asal daripada repositori (bukan lagi templat draf).
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

> Eksport MP4 memerlukan enjin pemaparan (Chromium tanpa kepala + FFmpeg). Ia berjalan melalui GitHub Actions atau
> pelayan tempatan, bukan di dalam fail pratonton, GitHub Pages atau Claude Artifact. Lihat
> [`docs/PANDUAN-EKSPORT-VIDEO.md`](docs/PANDUAN-EKSPORT-VIDEO.md).

## Teknologi

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · fflate · qrcode · jsQR · Vitest · Playwright (Chromium) · FFmpeg

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
npm run eksport:pelayan   # buka TikTok 60 Saat dengan butang Eksport MP4 yang aktif
npm run eksport:video     # hasilkan dan semak eksport/tiktok-60s.mp4 terus dari terminal
npm run semak:video       # semak semula eksport/tiktok-60s.mp4
```

Eksport MP4 tempatan juga memerlukan FFmpeg dan `npx playwright install chromium` (sekali sahaja).

## Pintasan papan kekunci (mod persembahan)

| Kekunci | Fungsi |
| --- | --- |
| Ruang / K | Mula atau Jeda |
| ← / → | Slaid sebelumnya / seterusnya |
| R | Ulang dari awal |
| H | Sembunyi / papar kawalan |
| F | Skrin penuh |
| G | Panduan kawasan selamat (TikTok 60 saat) |
| Esc | Tutup |

Dalam TikTok 60 saat, ← / → melompat antara bahagian (hook, kulit, halaman, kelebihan, proses, kod QR).

## Struktur projek

```
public/halaman/          ← letak 12 imej sebenar di sini (simpanan kekal)
pratonton/index.html     ← pratonton satu fail, dibuka tanpa Node.js
docs/PANDUAN-IMEJ.md     ← panduan memasukkan imej dan batasan storan
docs/PANDUAN-PENGGUNA.md ← panduan ringkas pengguna
docs/PANDUAN-EKSPORT-VIDEO.md ← panduan eksport MP4 (Fasa 4)
scripts/eksport-video.mjs ← pemapar MP4: Chromium tanpa kepala + jam maya + FFmpeg
scripts/jam-maya.mjs     ← jam maya untuk bingkai deterministik
scripts/semak-video.mjs  ← semakan MP4 akhir (metadata, animasi, kod QR)
scripts/pluginEksportVideo.ts ← API eksport untuk pelayan tempatan (butang Eksport MP4)
.github/workflows/eksport-video-tiktok.yml ← eksport MP4 melalui GitHub Actions
src/
├── data/buku.ts         ← maklumat buku dan 12 halaman
├── data/masterPrompt.ts ← master prompt asal (dibaca daripada prompts/)
├── data/tiktok.ts       ← garis masa TikTok 60 saat (diuji)
├── lib/kodQr.ts         ← penjanaan kod QR sebenar (diuji dengan pembaca QR)
├── data/slaid.ts        ← urutan dan tempoh slaid persembahan
├── lib/autoplay.ts      ← logik persembahan automatik (diuji)
├── lib/selak.ts         ← logik susunan muka animasi selak (diuji)
├── lib/susunFail.ts     ← pengesahan dan susunan fail mengikut nombor (diuji)
├── lib/pakej.ts         ← eksport/import pakej ZIP (diuji)
├── lib/storImej.ts      ← storan imej IndexedDB / sesi
├── components/pengurus/ ← Pengurus Halaman Buku
├── components/tiktok/   ← persembahan TikTok 60 saat, panel eksport dan halaman pemaparan
├── components/buku/     ← buku selak 3D dan muka halaman
└── components/          ← komponen antara muka
```
