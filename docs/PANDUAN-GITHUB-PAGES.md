# Panduan Menerbitkan Laman Perkongsian Master Prompt (GitHub Pages)

Panduan ini menerbitkan halaman **MASTER PROMPT PENUH** supaya kod QR dalam TikTok Cinematic Showcase
boleh diimbas oleh penonton. Ikut langkah mengikut urutan — **jangan** masukkan URL ke dalam aplikasi
sebelum halaman itu benar-benar boleh dibuka.

> **Penting:** Apa sahaja yang diterbitkan di GitHub Pages boleh dilihat oleh **sesiapa sahaja** di internet,
> termasuk master prompt dan 12 ilustrasi dalam `public/halaman/`. Pastikan anda bersedia berkongsi
> kandungan itu secara awam. Pada akaun GitHub percuma, repositori juga perlu **awam** untuk menggunakan Pages.

## Langkah 1 — Masukkan master prompt asal

1. Di GitHub, buka fail [`kandungan/master-prompt.txt`](../kandungan/master-prompt.txt) dan tekan ikon pensel (*Edit*).
2. Tampal master prompt asal yang **lengkap** di antara dua baris ini (jangan padam baris penanda):

   ```
   === MULA MASTER PROMPT ===
   (tampal di sini)
   === TAMAT MASTER PROMPT ===
   ```

3. Tekan **Commit changes** dan simpan ke cabang `main`.

Teks dipaparkan tepat seperti ditampal (baris, inden dan simbol dikekalkan). Arahan di luar penanda tidak dipaparkan
dan tidak disalin. Selagi ruang itu kosong, aplikasi memaparkan **MASTER PROMPT BELUM DIMASUKKAN**.

## Langkah 2 — Hidupkan GitHub Pages

1. Buka repositori → **Settings** → **Pages**.
2. Di bawah **Build and deployment**, pilih **Source: GitHub Actions**.

## Langkah 3 — Terbitkan

1. Buka tab **Actions** → pilih **Terbit ke GitHub Pages** → **Run workflow** → cabang `main` → **Run workflow**.
2. Tunggu kedua-dua kerja (*bina* dan *terbit*) bertanda hijau (biasanya 1–3 minit).
3. Klik pada larian itu; pautan laman dipaparkan pada kotak **terbit**.

Aliran kerja ini menjalankan ujian, membina aplikasi dan menerbitkan folder `dist/`. Ia hanya berjalan apabila anda
menekan **Run workflow**, jadi ulangi langkah ini setiap kali anda mengemas kini master prompt.

> Mahu terbit automatik setiap kali `main` dikemas kini? Dalam `.github/workflows/pages.yml`, tambah
> `push: { branches: [main] }` di bawah `on:` — hanya selepas Langkah 2 selesai.

## Langkah 4 — Sahkan URL awam

Untuk repositori `Nuraidah300376/ai-storybook-showcase`, GitHub Pages lazimnya menggunakan bentuk:

| Halaman | URL (sahkan dahulu) |
| --- | --- |
| Aplikasi penuh | `https://nuraidah300376.github.io/ai-storybook-showcase/` |
| **Master prompt penuh (untuk QR)** | `https://nuraidah300376.github.io/ai-storybook-showcase/prompt/` |

Gunakan URL sebenar yang dipaparkan oleh GitHub pada Langkah 3 jika berbeza (contohnya jika anda menggunakan domain sendiri).

Sebelum menjana QR, uji pautan **master prompt** itu:

- buka pada telefon lain menggunakan data mudah alih (bukan Wi-Fi yang sama) atau tetingkap inkognito;
- pastikan teks prompt penuh dipaparkan (bukan "BELUM DIMASUKKAN" dan bukan ralat 404);
- tekan **Salin Prompt** dan tampal di aplikasi nota untuk memastikan teks lengkap.

## Langkah 5 — Jana kod QR

Pilih **salah satu**:

**A. Kekal (disyorkan)** — edit [`src/data/tiktok.ts`](../src/data/tiktok.ts):

```ts
export const URL_PERKONGSIAN_PROMPT = 'https://nuraidah300376.github.io/ai-storybook-showcase/prompt/'
```

Commit, kemudian jalankan semula **Terbit ke GitHub Pages**. Kod QR muncul untuk semua orang yang membuka aplikasi.

**B. Sementara (pelayar ini sahaja)** — dalam aplikasi, tatal ke **TikTok Showcase**, tampal URL dalam kotak
**Kod QR perkongsian master prompt** dan tekan **Jana Kod QR**. URL disimpan dalam pelayar itu sahaja.

Aplikasi hanya menerima URL `https://` dengan domain awam; alamat seperti `localhost` atau `192.168.x.x` ditolak.
Aplikasi **tidak** dapat mengesahkan bahawa halaman wujud — itu sebabnya Langkah 4 wajib.

Selepas QR dijana, uji imbasan: buka showcase, lompat ke saat 52–60, dan imbas skrin dengan kamera telefon lain.
Butang **Muat turun QR (SVG)** menyimpan kod QR untuk dicetak atau digunakan dalam suntingan video.

## Langkah 6 — Rakam TikTok

1. Buka aplikasi → **Mod TikTok 9:16** (atau tambah `#/showcase` pada hujung URL).
2. Tekan **Skrin Penuh**, kemudian **Sembunyikan Kawalan**.
3. Mulakan perakam skrin, ketik skrin, tekan **Mula** dan sembunyikan kawalan semula.
4. Potong rakaman kepada 60 saat dalam aplikasi suntingan.

Aplikasi ini **tidak** mengeksport MP4 atau sebarang fail video; gunakan perakam skrin peranti.

Dalam kapsyen TikTok, tulis juga pautan prompt (atau "pautan di bio") untuk penonton yang tidak dapat mengimbas QR
daripada skrin yang sama.

## Masalah lazim

| Masalah | Penyelesaian |
| --- | --- |
| Ralat 404 | Tunggu beberapa minit selepas terbit; pastikan URL berakhir dengan `/prompt/` dan Source = GitHub Actions |
| Halaman memaparkan "BELUM DIMASUKKAN" | Prompt tidak berada di antara penanda, atau aliran kerja belum dijalankan semula selepas commit |
| Kerja *terbit* gagal: "Pages not enabled" | Lengkapkan Langkah 2, kemudian jalankan semula |
| QR tidak muncul dalam showcase | URL kosong atau ditolak — lihat mesej di panel **Kod QR perkongsian master prompt** |
| Imej buku tidak dipaparkan di Pages | Pastikan 12 fail ada dalam `public/halaman/` dengan nama `halaman-01.png` … `halaman-12.png` |
