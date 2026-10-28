# Panduan Memasukkan 12 Imej Halaman

Setiap halaman buku *Amanah Kecil, Hati Besar* ialah **satu imej A5 potret penuh**. Ilustrasi, wajah watak,
warna dan teks cerita sudah terkandung dalam imej. Aplikasi memaparkan imej itu sepenuhnya, tanpa dipotong,
dan **tidak** menambah teks cerita di atasnya.

Tiada imej buku disertakan dalam repositori. Selagi imej belum dimasukkan, setiap halaman memaparkan placeholder berlabel.

## Spesifikasi imej

| Perkara | Cadangan |
| --- | --- |
| Bilangan | 12 fail, satu bagi setiap halaman |
| Nisbah | A5 potret, 148 × 210 mm (≈ 1 : 1,414) |
| Saiz piksel | 1748 × 2480 (300 dpi) atau 1240 × 1754 (150 dpi, lebih ringan untuk web) |
| Format | `.png`, `.jpg`, `.jpeg` atau `.webp` |
| Saiz fail | Maksimum 25 MB setiap fail; di bawah 1 MB disyorkan untuk laman web |
| Nama fail | `halaman-01` hingga `halaman-12` (nombor menentukan susunan) |

Imej yang bukan nisbah A5 tetap dipaparkan penuh tanpa dipotong, tetapi ruang kosong akan kelihatan di tepi.
Pengurus Halaman Buku memaparkan amaran "Bukan nisbah A5" bagi imej seperti ini.

---

## Cara 1 — Pengurus Halaman Buku (dalam aplikasi)

1. Buka aplikasi dan tatal ke bahagian **Pengurus Halaman Buku** (atau tekan pautan *Pengurus Halaman* pada menu).
2. Tekan **Pilih Imej** dan pilih kesemua 12 fail sekali gus, atau seret dan lepas fail ke kotak muat naik.
3. Fail disusun secara automatik mengikut nombor dalam nama fail (lihat [Peraturan susunan](#peraturan-susunan)).
4. Placeholder digantikan serta-merta dalam paparan buku, lakaran kecil dan mod persembahan.

Bagi setiap slot:

| Butang | Fungsi |
| --- | --- |
| **Muat Naik** | Memilih imej untuk slot kosong |
| **Ganti Gambar** | Menggantikan imej sedia ada dalam slot itu |
| **Pratonton** | Memaparkan halaman dalam saiz penuh A5; ← → untuk bertukar halaman; *Lihat dalam buku* untuk melompat ke halaman itu |
| Ikon tong | Membuang imej yang dimuat naik (kembali ke fail kekal atau placeholder) |

Anda juga boleh menyeret satu imej terus ke atas slot tertentu.

### Di mana imej disimpan?

Imej yang dimuat naik disimpan dalam **storan pelayar (IndexedDB)** pada peranti dan pelayar yang anda gunakan.

- ✅ Imej kekal selepas halaman dimuat semula atau pelayar ditutup dan dibuka semula.
- ✅ Fail asal disimpan tanpa diubah: tiada pemampatan semula, tiada pemotongan, warna kekal.
- ❌ Imej **tidak** dihantar ke mana-mana pelayan.
- ❌ Imej **tidak** disimpan ke GitHub secara automatik.
- ❌ Penonton lain yang membuka pautan aplikasi anda **tidak** melihat imej ini.

**Batasan storan pelayar:**

- Hanya pada pelayar dan peranti itu. Imej tidak muncul pada telefon, komputer atau pelayar lain.
- Setiap alamat mempunyai storan sendiri: `localhost`, laman terbitan (contohnya GitHub Pages) dan fail
  `pratonton/index.html` tidak berkongsi imej.
- Imej hilang jika data laman, kuki atau sejarah pelayar dipadam.
- Tetingkap inkognito atau peribadi memadam semua imej apabila ditutup.
- Pelayar boleh membuang storan apabila ruang cakera rendah. Safari boleh memadam data laman yang tidak dibuka selama 7 hari.
- Kuota storan berbeza mengikut pelayar dan ruang kosong peranti.
- Jika storan pelayar tidak tersedia, aplikasi memaklumkan bahawa imej disimpan untuk **sesi ini sahaja**
  (hilang apabila tab ditutup atau dimuat semula).

Butang **Minta storan kekal** (jika dipaparkan) meminta pelayar supaya tidak membuang storan ini secara automatik.
Pelayar boleh menolak permintaan ini.

### Eksport dan import pakej

- **Eksport Pakej** memuat turun `amanah-kecil-hati-besar-halaman.zip` yang mengandungi:
  ```
  konfigurasi.json        ← tajuk buku, tarikh, senarai halaman, nama fail asal dan saiz imej
  BACA-SAYA.txt
  halaman/halaman-01.png  ← bait fail asal, tidak dimampat semula
  …
  halaman/halaman-12.png
  ```
  Pakej turut mengandungi fail dalam `public/halaman/` bagi slot yang tiada muat naik (jika boleh dibaca).
- **Import Pakej** memulihkan imej daripada pakej itu, mengikut nombor halaman dalam `konfigurasi.json`.
  ZIP biasa yang berisi imej bernombor juga diterima. Anda juga boleh menyeret fail ZIP ke kotak muat naik.

Gunakan eksport sebagai sandaran, atau untuk memindahkan imej ke pelayar atau peranti lain.

### Peraturan susunan

1. Nombor selepas kata kunci diutamakan: `halaman-03`, `hal 3`, `ms3`, `page_03`, `p3` → Halaman 03.
2. Jika tiada kata kunci, nombor pertama dari 1 hingga 12 digunakan: `Amanah 2024 - 07.png` → Halaman 07
   (2024 diabaikan kerana di luar julat).
3. `halaman-2` disusun sebelum `halaman-10` (susunan nombor, bukan abjad).
4. Fail tanpa nombor mengisi slot kosong mengikut susunan nama, dan aplikasi memaparkan amaran supaya anda menyemaknya.
5. Fail kedua dengan nombor yang sama, dan fail bukan PNG/JPG/JPEG/WebP, diabaikan dengan mesej yang jelas.

---

## Cara 2 — Simpan secara kekal dalam `public/halaman/`

Gunakan cara ini supaya **semua penonton, pada semua peranti** melihat imej yang sama.

### Melalui laman GitHub (tanpa memasang apa-apa)

1. Dalam aplikasi, tekan **Eksport Pakej** dan nyahzip fail yang dimuat turun.
   Folder `halaman/` di dalamnya sudah mengandungi fail bernama betul.
2. Buka repositori di GitHub, kemudian masuk ke folder `public/halaman`.
3. Tekan **Add file → Upload files**, seret kesemua 12 imej, tulis mesej ringkas, kemudian tekan **Commit changes**.
4. Bina dan terbitkan semula aplikasi (atau jalankan `npm run build` / `npm run binaan:pratonton`).

### Melalui komputer (dengan Git)

```
public/
└── halaman/
    ├── halaman-01.png
    ├── halaman-02.png
    ├── …
    └── halaman-12.png
```

Salin fail ke folder di atas, kemudian `git add public/halaman && git commit && git push`.

Jika satu halaman mempunyai lebih daripada satu format, aplikasi memilih mengikut urutan:
`.webp` → `.jpg` → `.jpeg` → `.png`.

### Keutamaan sumber imej

1. Imej yang dimuat naik melalui Pengurus Halaman Buku (dalam pelayar itu sahaja)
2. Fail dalam `public/halaman/`
3. Placeholder berlabel

Buang imej yang dimuat naik (ikon tong) untuk kembali kepada fail dalam `public/halaman/`.

### Fail pratonton tanpa Node.js

Fail `pratonton/index.html` membaca imej daripada folder `halaman/` **di sebelahnya**:

```
pratonton/
├── index.html
└── halaman/
    ├── halaman-01.png
    └── …
```

---

## (Pilihan) Teks alternatif dan master prompt

- **Teks alternatif imej:** kemas kini medan `alt` dalam `src/data/buku.ts` supaya pembaca skrin dapat menerangkan setiap halaman.
- **Master prompt:** gantikan kandungan `MASTER_PROMPT` dalam `src/data/masterPrompt.ts`, dan tukar
  `STATUS_PROMPT` kepada `'sebenar'` untuk membuang label “Templat draf”.
