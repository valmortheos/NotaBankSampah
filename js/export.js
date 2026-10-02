// Export Nota ke PNG via html2canvas & Trigger Print

import { ensureImagesLoaded } from './signature.js';

export function exportToPng(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Elemen nota tidak ditemukan.');
    return;
  }

  // Preload semua gambar
  ensureImagesLoaded(element).then(() => {
    // Pakai html2canvas (global dari CDN)
    if (typeof window.html2canvas !== 'function') {
      alert('Library html2canvas belum siap. Pastikan koneksi internet aktif.');
      return;
    }

    window.html2canvas(element, {
      scale: 2, // Scale 2x untuk retina display / high DPI
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Force opacity 1 pada signature aktif di DOM kloning
        const activeSigs = clonedDoc.querySelectorAll('.sig-box.active .sig-img');
        activeSigs.forEach(img => {
          img.style.opacity = '1';
          img.style.visibility = 'visible';
        });

        // Ensure table layout fixed & cell nowrap in canvas clone
        const table = clonedDoc.querySelector('.nota-table');
        if (table) {
          table.style.tableLayout = 'fixed';
          table.style.width = '100%';
        }
      }
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename || 'Nota.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => {
      console.error('Gagal mengeksport nota ke PNG:', err);
      alert('Terjadi kesalahan saat mengunduh gambar nota.');
    });
  });
}

export function triggerPrint() {
  window.print();
}
