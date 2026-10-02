# Aplikasi Web Nota Digital — Bank Sampah Saling

Aplikasi web statis, modular, responsive, dan minimalis untuk pembuatan dan pencetakan nota digital Bank Sampah Saling.

## CARA MENJALANKAN

Aplikasi ini menggunakan JavaScript ES Modules (`type="module"`), sehingga **wajib** dijalankan melalui HTTP server lokal (bukan protokol `file://`).

Gunakan salah satu perintah berikut di root folder project:

```bash
# Menggunakan Python 3
python -m http.server 8000

# Atau menggunakan Node.js (npx)
npx serve .
```

Kemudian buka browser dan akses: `http://localhost:8000`

## STRUKTUR FOLDER

```
/
├── index.html            # Halaman utama aplikasi
├── css/
│   ├── base.css          # Reset CSS, variabel/tokens CSS, tipografi
│   ├── layout.css        # Grid utama desktop/mobile, header, panel editor & preview
│   ├── form.css          # Styling form editor, item row, segmented toggle
│   ├── nota.css          # Styling kartu preview nota, tabel, tanda tangan
│   └── print.css         # @media print stylesheet (A4 format & manipulasi cetak)
├── js/
│   ├── config.js         # Konstanta brand, alamat, format Rp, default item, key tanda tangan
│   ├── state.js          # Object state utama & reducer pengelolaan data nota
│   ├── form.js           # Event binding input, tambah/hapus item, toggle tanda tangan
│   ├── render.js         # Fungsi render real-time preview nota dari state
│   ├── signature.js      # Pengelolaan toggle tanda tangan & preloading asset
│   ├── export.js         # Pengunduhan nota ke PNG via html2canvas & trigger cetak
│   └── main.js           # Bootstrap aplikasi & wiring eventlistener utama
├── assets/
│   ├── logo.png          # Logo placeholder (256x256 PNG)
│   ├── favicon.png       # Favicon (32x32 PNG)
│   └── signatures/
│       ├── sekretaris.png   # Placeholder TDT Sekretaris (400x120 PNG transparan)
│       ├── bendahara.png    # Placeholder TDT Bendahara (400x120 PNG transparan)
│       └── ketua.png        # Placeholder TDT Ketua (400x120 PNG transparan)
├── README.md             # Dokumentasi proyek
└── setup.txt             # Daftar link CDN dependency eksternal
```

## DEPENDENCY EKSTERNAL (CDN)

1. **Font Awesome 6.5.2** - Icon set
   `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`
2. **Google Fonts (Inter & JetBrains Mono)** - Tipografi
   `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap`
3. **html2canvas 1.4.1** - Export gambar PNG
   `https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`

## FITUR UTAMA

1. **Editor Form Dynamic**: Input nomor nota, tanggal, jenis transaksi (Pemasukan/Pengeluaran), daftar item dinamis (nama, qty, harga per unit), catatan, serta toggle tanda tangan.
2. **Real-time Real-time Preview**: Tampilan nota yang secara otomatis diperbarui sesuai perubahan input.
3. **Unduh PNG Retina**: Mengunduh tampilan nota beresolusi tinggi (scale 2x) dalam format PNG.
4. **Optimasi Cetak (Print Ready)**: Format layout siap cetak ukuran A4 tanpa border/shadow tambahan.
