# Aplikasi Web Nota Digital — Bank Sampah Saling

Aplikasi web statis, modular, responsive, dan minimalis untuk pembuatan dan pencetakan nota digital Bank Sampah Saling.

## CARA MENJALANKAN

Aplikasi ini menggunakan JavaScript ES Modules (`type="module"`) dan melakukan pengambilan data konfigurasi dari file `data/company.json`. Oleh karena itu, aplikasi **wajib** dijalankan melalui HTTP server lokal (bukan melalui protokol `file://`).

Gunakan salah satu perintah berikut di root folder project:

```bash
# Menggunakan Python 3
python -m http.server 8000

# Atau menggunakan Node.js (npx)
npx serve .
```

Kemudian buka browser dan akses: `http://localhost:8000`

## SKEMA JSON DAN KONFIGURASI PERUSAHAAN (`data/company.json`)

Metadata merek, alamat, dan teks catatan kaki diatur secara eksternal pada file `data/company.json`. Anda dapat mengubah informasi ini tanpa perlu menyunting file HTML atau JavaScript.

### Skema JSON:

```json
{
  "brand": {
    "name": "Bank Sampah Saling",
    "tagline": "Unit Pengolahan & Daur Ulang",
    "address": {
      "street": "Jl. Merdeka No. 45",
      "kelurahan": "Kel. Sukamaju",
      "kecamatan": "Kec. Cibeunying",
      "city": "Bandung",
      "postalCode": "40123"
    },
    "footer": "Terima kasih telah berkontribusi dalam menjaga kelestarian lingkungan."
  }
}
```

### Cara Mengubah Data Perusahaan & Alamat:
1. Buka file `data/company.json`.
2. Ubah properti di dalam objek `brand`, `address`, atau `footer`.
3. Simpan file dan muat ulang halaman pada browser.

## CARA KERJA NOMOR NOTA (NO. NOTA)

Format nomor nota secara otomatis disesuaikan menjadi:
`<SLUG>/<YYYY>/<NNN>`

- `<SLUG>`: Singkatan nama merek (misalnya `BSS` untuk Bank Sampah Saling).
- `<YYYY>`: Tahun saat ini yang dihitung secara dinamis pada saat runtime (misalnya `2026`).
- `<NNN>`: Nomor urut 3 digit berawalan nol (misalnya `001`).

### Mekanisme Urutan & Penyimpanan:
1. Pengguna hanya perlu menyunting nomor urut (sequence). Awalan prefix bersifat read-only.
2. Nomor urut terakhir yang digunakan tersimpan secara otomatis pada `localStorage` browser.
3. Tombol **Nota Baru** pada header akan menaikkan nomor urut secara otomatis (+1), menyimpannya ke `localStorage`, dan mengosongkan formulir untuk pembuat nota berikutnya.

## STRUKTUR FOLDER

```
/
├── index.html            # Halaman utama aplikasi
├── data/
│   └── company.json      # Konfigurasi data perusahaan & alamat
├── css/
│   ├── base.css          # Reset CSS, variabel/tokens CSS, tipografi
│   ├── layout.css        # Grid utama desktop/mobile, header, panel editor & preview
│   ├── form.css          # Styling form editor, item row, segmented toggle
│   ├── nota.css          # Styling kartu preview nota, tabel, tanda tangan
│   └── print.css         # @media print stylesheet (A4 format & manipulasi cetak)
├── js/
│   ├── config.js         # Wrapper storage, helper format, fallback data
│   ├── state.js          # Object state utama & reducer pengelolaan data nota
│   ├── form.js           # Event binding input, tambah/hapus item, toggle tanda tangan
│   ├── render.js         # Fungsi render real-time preview nota dari state
│   ├── signature.js      # Pengelolaan toggle tanda tangan & preloading asset
│   ├── export.js         # Pengunduhan nota ke PNG via html2canvas & trigger cetak
│   └── main.js           # Bootstrap aplikasi & wiring eventlistener utama
├── assets/
│   ├── logo.png          # Logo brand (256x256 PNG)
│   └── signatures/
│       ├── sekretaris.png   # Placeholder TDT Sekretaris
│       ├── bendahara.png    # Placeholder TDT Bendahara
│       └── ketua.png        # Placeholder TDT Ketua
└── README.md             # Dokumentasi proyek
```
