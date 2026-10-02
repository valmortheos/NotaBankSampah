// Konstanta dan konfigurasi global aplikasi Nota Digital

export const APP_CONFIG = {
  BRAND_NAME: 'Bank Sampah Saling',
  BRAND_SUBTITLE: 'Unit Pengolahan & Daur Ulang',
  BRAND_ADDRESS: 'Jl. Merdeka No. 45, Kel. Sukamaju, Kec. Cibeunying, Bandung 40123',
  BRAND_LOGO: 'assets/logo.png',
  FOOTER_TEXT: 'Terima kasih telah berkontribusi dalam menjaga kelestarian lingkungan.',

  TRANSACTION_TYPES: {
    INCOME: 'pemasukan',
    EXPENSE: 'pengeluaran'
  },

  SIGNATURE_KEYS: ['sekretaris', 'bendahara', 'ketua'],

  SIGNATURE_ROLES: {
    sekretaris: 'Sekretaris',
    bendahara: 'Bendahara',
    ketua: 'Ketua Bank Sampah'
  },

  SIGNATURE_ASSETS: {
    sekretaris: 'assets/signatures/sekretaris.png',
    bendahara: 'assets/signatures/bendahara.png',
    ketua: 'assets/signatures/ketua.png'
  },

  DEFAULT_ITEMS: [
    { id: 1, name: 'Sampah Plastik PET', qty: 5, price: 3500 },
    { id: 2, name: 'Kardus Bekas', qty: 12, price: 2000 },
    { id: 3, name: 'Minyak Jelantah (Liter)', qty: 3, price: 7500 }
  ]
};

// Formatter Rupiah Indonesia (Rp xx.xxx)
export const formatRupiah = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

// Formatter Tanggal Format Indonesia (misal: 24 Mei 2024)
export const formatDateIndonesian = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Helper Generate Nomor Nota Default
export const generateDefaultNotaNo = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 900) + 100);
  return `NOTA-${year}${month}-${random}`;
};

// Helper Get Tanggal Hari Ini (YYYY-MM-DD)
export const getTodayDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};
