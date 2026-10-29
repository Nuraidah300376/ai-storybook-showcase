# Panduan Eksport Video MP4 — TikTok 60 Saat (Fasa 4)

Panduan ini menerangkan cara mendapatkan **video TikTok 60 saat yang siap** dalam format MP4,
tanpa perlu merakam skrin.

| Ciri video | Nilai |
| --- | --- |
| Format | MP4 (H.264, yuv420p — diterima TikTok, Instagram, YouTube Shorts, WhatsApp) |
| Resolusi | 1080 × 1920 piksel, nisbah 9:16 |
| Kadar bingkai | 30 fps (1800 bingkai) |
| Tempoh | Tepat 60 saat |
| Audio | Tiada (tambah muzik dalam TikTok, atau lihat [Menambah audio](#menambah-audio-pilihan)) |
| Kandungan | Animasi sebenar: tajuk, kulit buku, 12 halaman dengan selakan 3D, kapsyen, 4 kelebihan, proses, kod QR dan kredit penulis |

Tiada bar pelayar, butang kawalan, kursor atau ruang hitam di sisi.

---

## Pilih satu cara

| Cara | Sesuai untuk | Perlu pasang apa-apa? | Imej yang digunakan |
| --- | --- | --- | --- |
| **A. GitHub Actions** | Paling mudah, tiada pemasangan | Tidak | Imej dalam `public/halaman/` di GitHub |
| **B. Butang satu klik di komputer** | Mahu guna imej yang dimuat naik dalam pelayar / kod QR sendiri | Node.js dan FFmpeg | Imej dimuat naik + `public/halaman/` + QR tersuai |
| C. Satu arahan di terminal | Pengguna yang biasa dengan terminal | Node.js dan FFmpeg | `public/halaman/` |

---

## Cara A — GitHub Actions (disyorkan, tanpa pemasangan)

1. Buka repositori di GitHub: `https://github.com/Nuraidah300376/ai-storybook-showcase`.
2. Tekan tab **Actions** di bahagian atas.
3. Di senarai kiri, tekan **Eksport Video TikTok**.
4. Di sebelah kanan, tekan butang **Run workflow**, biarkan *Branch: main*, kemudian tekan butang hijau **Run workflow**.
5. Tunggu kira-kira **10–20 minit**. Muat semula halaman; larian baharu bertukar daripada bulatan kuning kepada **tanda ✔ hijau**.
6. Tekan nama larian itu. Di bahagian bawah, pada **Artifacts**, tekan **video-tiktok-60s** untuk memuat turun fail ZIP.
7. Buka (extract) ZIP tersebut. Fail video ialah **`tiktok-60s.mp4`**.

Dalam ZIP juga terdapat:

- `tiktok-60s-laporan.json` — keputusan semakan automatik;
- `tiktok-60s-lembaran.jpg` — 12 gambar kecil daripada video untuk semakan pantas;
- `tiktok-60s.json` — maklumat pemaparan.

Ringkasan semakan juga dipaparkan terus pada halaman larian (bahagian *Summary*).

> Tanda ✘ merah bermaksud ada semakan yang gagal — jangan gunakan video itu. Buka langkah yang merah untuk melihat sebabnya.
> Artifak disimpan oleh GitHub selama 30 hari.

**Mahu guna imej baharu?** Cara A menggunakan imej yang tersimpan dalam folder `public/halaman/` di GitHub.
Gantikan fail di sana dahulu (lihat [PANDUAN-IMEJ.md](PANDUAN-IMEJ.md)), kemudian jalankan semula.

---

## Cara B — Butang EKSPORT VIDEO MP4 di komputer sendiri

### Pemasangan (sekali sahaja)

1. **Node.js 20 atau lebih baharu** — muat turun versi *LTS* dari <https://nodejs.org> dan pasang (tekan *Next* hingga selesai).
2. **FFmpeg**:
   - Windows: buka *Terminal* atau *PowerShell*, taip `winget install Gyan.FFmpeg`, tekan Enter. Tutup dan buka semula terminal.
   - macOS: pasang [Homebrew](https://brew.sh), kemudian `brew install ffmpeg`.
   - Ubuntu/Linux: `sudo apt install ffmpeg`.
   - Semak: taip `ffmpeg -version`. Jika keluar maklumat versi, FFmpeg sudah sedia.
3. **Muat turun projek**: di GitHub tekan **Code → Download ZIP**, kemudian extract ke folder, contohnya `Dokumen/ai-storybook-showcase`.
4. Buka terminal **di dalam folder projek** (Windows: dalam folder itu, klik kanan → *Open in Terminal*), kemudian taip:

   ```bash
   npm install
   ```

   ```bash
   npx playwright install chromium
   ```

   Arahan kedua memuat turun pelayar Chromium khas yang digunakan untuk melukis video (±150 MB, sekali sahaja).

### Setiap kali mahu mengeksport

1. Dalam terminal di folder projek, taip:

   ```bash
   npm run eksport:pelayan
   ```

   Pelayar dibuka secara automatik dalam mod **TikTok 60 Saat**. Jangan tutup terminal.
2. (Pilihan) Muat naik imej halaman di *Pengurus Halaman Buku*, atau tukar kod QR melalui butang **QR** — kedua-duanya akan dimasukkan ke dalam video.
3. Pada bar kawalan TikTok 60 Saat, tekan **Eksport MP4**.
4. Tekan **Mula Eksport MP4**. Bar kemajuan memaparkan bingkai yang sudah dilukis (contohnya *Bingkai 600/1800 · 33%*) dan anggaran baki masa.
   Anda boleh terus menggunakan aplikasi; video dilukis dalam pelayar tersembunyi yang berasingan.
5. Selepas semua bingkai dilukis, fail MP4 **disemak secara automatik** (codec, resolusi, fps, durasi, animasi dan kod QR).
6. Apabila keluar **Berjaya** bersama senarai semakan bertanda ✔, tekan **Muat Turun MP4**.
   Salinan fail juga disimpan dalam folder `eksport/` projek.
7. Jika keluar **Gagal**, baca sebabnya pada panel, kemudian tekan **Cuba Lagi**.

Untuk berhenti, tekan `Ctrl + C` dalam terminal.

---

## Cara C — Satu arahan di terminal

Selepas pemasangan Cara B:

```bash
npm run eksport:video
```

Arahan ini membina aplikasi, melukis video ke `eksport/tiktok-60s.mp4`, kemudian menyemaknya. Untuk menyemak semula fail sedia ada:

```bash
npm run semak:video
```

---

## Menambah audio (pilihan)

Secara lalai video **tidak mempunyai audio** — cara biasa ialah memilih muzik terus dalam TikTok. Jika anda mempunyai fail muzik
sendiri yang anda berhak gunakan:

```bash
npm run build
```

```bash
node scripts/eksport-video.mjs --audio muzik.mp3
```

Audio dipotong atau dipanjangkan (senyap) supaya tepat 60 saat, dan dikodkan sebagai AAC.

---

## Semakan automatik pada setiap video

Video hanya dilaporkan **berjaya** selepas fail MP4 akhir lulus semua semakan ini:

1. bekas MP4, codec H.264, format piksel yuv420p;
2. resolusi 1080×1920, nisbah 9:16 dengan piksel segi empat;
3. 30 fps, durasi 60.0 saat, tepat 1800 bingkai;
4. tiada trek audio (atau satu trek AAC jika `--audio` digunakan);
5. **bingkai animasi sebenar** — sekurang-kurangnya 90% pasangan bingkai berturut-turut berbeza, dan setiap satu daripada
   11 selakan halaman bergerak merentasi banyak bingkai (bukan pertukaran slaid serta-merta);
6. tiada ruang hitam di tepi bingkai;
7. **kod QR boleh diimbas** pada 54, 56, 58 dan 59.9 saat — pada saiz penuh dan apabila dikecilkan kepada 540×960 dan
   360×640 (seperti di skrin telefon) — dan menghala ke pautan yang betul.

---

## Kenapa video tidak dihasilkan terus dalam pelayar atau Claude Artifact?

- Pelayar tidak boleh "mengambil gambar" kandungan halaman (animasi 3D CSS, kabur, teks) bingkai demi bingkai dengan tepat.
  Satu-satunya cara dalam pelayar ialah merakam skrin secara masa nyata (`MediaRecorder`/perkongsian skrin), yang memerlukan
  kebenaran pengguna, bergantung pada kelajuan komputer (bingkai boleh tercicir) dan, pada banyak pelayar, menghasilkan WebM,
  bukan MP4.
- Fail pratonton (`pratonton/index.html`), GitHub Pages dan Claude Artifact ialah halaman statik — tiada pelayan untuk
  menjalankan Chromium dan FFmpeg. Butang **Eksport MP4** di sana menerangkan sekatan ini dan memberi pautan ke Cara A;
  ia tidak berpura-pura mengeksport.

## Bagaimana video dilukis (ringkasan teknikal)

- **Pemaparan berasaskan bingkai yang deterministik.** Skrip `scripts/eksport-video.mjs` membuka halaman khas
  `#render-tiktok` dalam Chromium tanpa kepala (Playwright). Sebelum aplikasi dimuat, **jam maya** (`scripts/jam-maya.mjs`)
  menggantikan `performance.now`, `Date`, `setTimeout`, `setInterval` dan `requestAnimationFrame`. Masa hanya bergerak apabila
  skrip memintanya: bingkai ke-*n* sentiasa menunjukkan keadaan tepat pada *n*/30 saat, walau berapa lama komputer mengambil
  masa untuk melukisnya. Animasi Motion dipaksa menggunakan JavaScript (bukan Web Animations pada jam sebenar), dan peralihan
  CSS dijeda serta dicari mengikut jam maya.
- Komponen yang dilukis ialah **`PentasTikTok` yang sama** seperti di skrin (selakan 3D, kapsyen, kod QR SVG sebenar), pada
  skala 1:1 di 1080×1920.
- Setiap bingkai ditangkap sebagai PNG (tanpa kehilangan kualiti) dan dihantar terus kepada **FFmpeg/libx264**
  (CRF 18, profil High 4.1, BT.709, `+faststart`).
- Ujian kebolehulangan: keadaan DOM (transform, kelegapan, penapis setiap elemen) pada setiap bingkai adalah sama antara
  larian. Nilai piksel boleh berbeza sangat sedikit (purata < 2/255, tidak kelihatan) kerana pengrasteran dalaman Chromium.
- **Remotion dinilai tetapi tidak dipilih**: ia memerlukan semua adegan ditulis semula sebagai fungsi `useCurrentFrame()`
  (animasi Motion dan buku selak sedia ada tidak boleh digunakan terus), menambah kebergantungan besar dan syarat lesen
  syarikat. Kaedah di atas menggunakan prinsip yang sama (Chromium tanpa kepala + FFmpeg) pada komponen sedia ada, jadi video
  sentiasa sepadan dengan persembahan di skrin.

## Penyelesaian masalah

| Masalah | Penyelesaian |
| --- | --- |
| Panel berkata *Eksport MP4 tidak boleh dijalankan di sini* | Anda membuka laman statik/pratonton. Guna Cara A, atau jalankan `npm run eksport:pelayan` (Cara B). |
| *FFmpeg tidak ditemui* | Pasang FFmpeg (langkah 2 Cara B), tutup terminal, buka semula, jalankan `npm run eksport:pelayan` sekali lagi. |
| *Executable doesn't exist … chromium* | Jalankan `npx playwright install chromium`. |
| *Eksport lain sedang berjalan* | Hanya satu eksport pada satu masa. Tunggu atau tekan **Batal eksport**. |
| Halaman dalam video memaparkan placeholder | Fail imej tiada dalam `public/halaman/` dan tidak dimuat naik. Lihat [PANDUAN-IMEJ.md](PANDUAN-IMEJ.md). |
| Eksport sangat perlahan | Normal pada komputer lama (±1–3 bingkai sesaat). Tutup aplikasi berat lain. |
