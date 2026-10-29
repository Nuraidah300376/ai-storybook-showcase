# Panduan Ringkas Pengguna — Fasa 4

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
| TikTok 9:16 | Butang **Mod TikTok 9:16** (satu halaman A5) |
| Mula / Jeda | Butang Mula/Jeda atau kekunci Ruang |
| Ulang | Butang Ulang atau kekunci R |
| Skrin penuh | Butang skrin penuh atau kekunci F |
| Sembunyi kawalan | Butang mata atau kekunci H |

Untuk video TikTok siap tanpa perakam skrin, gunakan **Eksport MP4** dalam mod TikTok 60 Saat — lihat bahagian di bawah.

## Persembahan TikTok 60 saat (Fasa 3)

1. Tekan **TikTok 60 Saat: Master Prompt** (halaman utama atau bahagian Persembahan).
   Pautan terus: tambah `#tiktok-60` pada alamat aplikasi.
2. Semak lencana **12/12 imej** pada bar kawalan — semua halaman sudah dimuat.
3. Pilihan: tekan butang **QR** untuk menggantikan kod QR dengan imej PNG/JPG sendiri. Imej yang tiada kod QR
   yang boleh dibaca akan ditolak. Tekan *Guna kod dijana* untuk kembali kepada kod QR automatik.
4. Pilihan: tekan butang **kawasan selamat** (atau G) untuk melihat kawasan yang dilindungi antara muka TikTok.
5. Tekan **Skrin Penuh**, mulakan perakam skrin, kemudian tekan **Rakam Bersih**: kawalan disembunyikan dan
   persembahan bermula dari 0:00 selepas 2 saat. Potong 2 saat pertama semasa menyunting.
6. Ketik skrin atau tekan H untuk memaparkan semula kawalan.

Nota: skrin penuh tidak disokong oleh Safari pada iPhone; gunakan perakam skrin terus dalam paparan biasa.

## Eksport Video MP4 (Fasa 4)

Dapatkan video TikTok 60 saat yang siap (MP4, 1080×1920, 30 fps) tanpa merakam skrin:

- **Paling mudah:** di GitHub, buka **Actions → Eksport Video TikTok → Run workflow**. Selepas ✔ hijau, muat turun artifak
  **video-tiktok-60s**.
- **Satu klik di komputer sendiri:** jalankan `npm run eksport:pelayan`, tekan **Eksport MP4** → **Mula Eksport MP4**,
  tunggu bar kemajuan, kemudian **Muat Turun MP4**.

Panduan penuh langkah demi langkah: [PANDUAN-EKSPORT-VIDEO.md](PANDUAN-EKSPORT-VIDEO.md).

