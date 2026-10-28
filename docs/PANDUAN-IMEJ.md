# Panduan Memasukkan 12 Imej Sebenar

Pada Fasa 1, setiap halaman buku memaparkan **placeholder berlabel** (contoh: “01 · Halaman 1 · Placeholder imej”).
Tiada imej buku palsu disertakan. Ikuti langkah di bawah untuk menggantikannya dengan ilustrasi sebenar
*Amanah Kecil, Hati Besar*.

## 1. Sediakan imej

| Perkara | Cadangan |
| --- | --- |
| Bilangan | 12 fail (satu bagi setiap halaman) |
| Nisbah | 4:3 (landskap) disyorkan; nisbah lain tetap dipaparkan penuh tanpa dipotong |
| Saiz | Lebar sekitar 1600 piksel |
| Format | `.webp` (paling ringan), `.jpg`, `.jpeg` atau `.png` |
| Saiz fail | Sebaik-baiknya di bawah 500 KB setiap satu |

## 2. Namakan fail

Gunakan nombor dua digit:

```
halaman-01.webp
halaman-02.webp
...
halaman-12.webp
```

Jika satu halaman mempunyai lebih daripada satu format, aplikasi memilih mengikut urutan:
`.webp` → `.jpg` → `.jpeg` → `.png`.

## 3. Letakkan dalam folder `public/halaman/`

```
public/
└── halaman/
    ├── halaman-01.webp
    ├── ...
    └── halaman-12.webp
```

## 4. Lihat hasilnya

- Semasa pembangunan (`npm run dev`), muat semula pelayar.
- Untuk versi terbit, jalankan `npm run build` sekali lagi.

Imej dikesan secara automatik dan menggantikan placeholder di paparan buku, lakaran kecil
dan mod persembahan. Tiada kod perlu diubah.

## 5. (Pilihan) Masukkan teks cerita dan master prompt sebenar

- **Teks halaman:** dalam `src/data/buku.ts`, tukar `teks: null` kepada teks sebenar bagi setiap halaman.
  Cara paling mudah ialah menggantikan blok `HALAMAN` dengan senarai bertulis, contohnya:

  ```ts
  const TEKS = [
    'Teks halaman 1 ...',
    'Teks halaman 2 ...',
    // ... sehingga 12
  ]
  // kemudian dalam HALAMAN: teks: TEKS[i] ?? null,
  ```

- **Teks alternatif imej:** kemas kini medan `alt` supaya pembaca skrin dapat menerangkan setiap ilustrasi.
- **Master prompt:** gantikan kandungan `MASTER_PROMPT` dalam `src/data/masterPrompt.ts`, dan tukar
  `STATUS_PROMPT` kepada `'sebenar'` untuk membuang label “Templat draf”.
