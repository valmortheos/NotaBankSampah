// Pengaturan dan konstanta global aplikasi Nota Digital

// Storage Keys
export const STORAGE_KEYS = {
  sequence: 'bss.sequence',
  draft: 'bss.draft'
};

// Wrapper defensif untuk akses localStorage
export const safeGetStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (err) {
    return fallback;
  }
};

export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // Membiarkan kegagalan penyimpanan secara senyap jika storage diblokir
  }
};

export const safeRemoveStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // Membiarkan kegagalan secara senyap
  }
};

// Fallback data perusahaan jika fetch data/company.json gagal
export const FALLBACK_COMPANY = {
  brand: {
    name: "Bank Sampah Saling",
    tagline: "Unit Pengolahan & Daur Ulang",
    address: {
      street: "Jl. Merdeka No. 45",
      kelurahan: "Kel. Sukamaju",
      kecamatan: "Kec. Cibeunying",
      city: "Bandung",
      postalCode: "40123"
    },
    footer: "Terima kasih telah berkontribusi dalam menjaga kelestarian lingkungan."
  }
};

// Helper membuat slug brand (misal: Bank Sampah Saling -> BSS)
export const getBrandSlug = (brandName) => {
  if (!brandName) return 'BSS';
  const words = brandName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }
  return words.map(w => w[0]).join('').toUpperCase();
};

// Helper format alamat perusahaan menjadi string multi-baris
export const formatAddressLines = (addressObj) => {
  if (!addressObj) return '';
  if (typeof addressObj === 'string') return addressObj;

  const parts = [];
  if (addressObj.street) parts.push(addressObj.street);
  const kelKec = [addressObj.kelurahan, addressObj.kecamatan].filter(Boolean).join(', ');
  if (kelKec) parts.push(kelKec);
  const cityPostal = [addressObj.city, addressObj.postalCode].filter(Boolean).join(' ');
  if (cityPostal) parts.push(cityPostal);

  return parts.join('<br>');
};

// Helper format sequence angka menjadi 3 digit berawalan nol (001, 002, dst)
export const formatSequenceNumber = (seq) => {
  const num = parseInt(seq, 10);
  if (isNaN(num) || num < 1) return '001';
  return String(num).padStart(3, '0');
};

export const APP_CONFIG = {
  BRAND_LOGO: 'assets/logo.png',

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

// Formatter Tanggal Format Indonesia
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

// Helper Get Tanggal Hari Ini (YYYY-MM-DD)
export const getTodayDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};
