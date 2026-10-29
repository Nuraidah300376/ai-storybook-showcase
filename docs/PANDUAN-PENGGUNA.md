# Panduan Ringkas Pengguna — Fasa 3

## Membuka aplikasi tanpa Node.js

1. Di GitHub, buka folder `pratonton/` dan muat turun `index.html` (butang **Download raw file**).
2. Klik dua kali pada fail itu. Aplikasi dibuka dalam pelayar, tanpa pemasangan dan tanpa internet.

## Memasukkan 12 imej halaman

1. Tatal ke **Pengurus Halaman Buku** atau tekan *Pengurus Halaman* pada menu.
2. Tekan **Pilih Imej**, pilih kesemua 12 fail (`halaman-01` … `halaman-12`), kemudian tekan *Open*.
3. Semak 12 slot: setiap slot memaparkan nombor halaman, nama fail dan sumbernya.
4. Untuk menukar satu halaman, tekan **Ganti Gambar** pada slot itu.
5. Tekan **Pratonton** untuk melihat halaman dalam saiz penuh A5.

## Menyimpan dengan selamat

- Imej disimpan dalam **pelayar ini sahaja** — bukan di GitHub dan bukan di pelayan.
- Tekan **Eksport Pakej** untuk memuat turun sandaran ZIP. Simpan fail ini.
- Pada komputer atau pelayar lain, tekan **Import Pakej** dan pilih fail ZIP itu.
- Untuk simpanan kekal yang dilihat semua penonton, salin folder `halaman/` daripada ZIP ke
  `public/halaman/` dalam repositori. Lihat [PANDUAN-IMEJ.md](PANDUAN-IMEJ.md#cara-2--simpan-secara-kekal-dalam-publichalaman).

## Menayang dan merakam

| Tindakan | Cara |
| --- | --- |
| Baca buku | Butang Sebelumnya/Seterusnya, kekunci ← →, ketik tepi halaman atau leret |
| Persembahan 16:9 | Butang **Mod Persembahan** (dua halaman A5 bersebelahan) |
| TikTok Cinematic Showcase | Butang **Mod TikTok 9:16** — persembahan 60 saat, 1080×1920 |
| Persembahan menegak lama | Bahagian **Mod Persembahan Automatik** → *Menegak 9:16* |
| Lompat masa (showcase) | Seret garis masa, atau kekunci ← → (5 saat) |
| Zon selamat TikTok | Butang **Zon Selamat** atau kekunci Z |
| Mula / Jeda | Butang Mula/Jeda atau kekunci Ruang |
| Ulang | Butang Ulang atau kekunci R |
| Skrin penuh | Butang skrin penuh atau kekunci F |
| Sembunyi kawalan | Butang mata atau kekunci H |

Aplikasi tidak mengeksport video. Gunakan perakam skrin telefon atau komputer semasa persembahan dimainkan.

## Master prompt dan kod QR (Fasa 3)

1. Tampal master prompt asal di antara penanda dalam `kandungan/master-prompt.txt`.
2. Terbitkan ke GitHub Pages dan uji pautan `…/prompt/` pada telefon lain.
3. Tetapkan URL itu (dalam `src/data/tiktok.ts` atau panel **Kod QR perkongsian master prompt**) — kod QR sebenar dijana.

Langkah penuh: [PANDUAN-GITHUB-PAGES.md](PANDUAN-GITHUB-PAGES.md). Selagi URL belum ditetapkan, showcase
memaparkan placeholder **BELUM DIKONFIGURASI**.
