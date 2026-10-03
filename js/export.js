// Export Nota ke PNG via html2canvas & Trigger Print
//
// Ekspor tidak memotret kartu di layar. Kartu diklon ke host di luar layar
// dengan lebar tetap (EXPORT_WIDTH) agar hasil selalu memakai layout tabel penuh,
// terlepas dari lebar layar perangkat.

import { ensureImagesLoaded } from './signature.js';

const EXPORT_WIDTH = 800;       // px, setara kertas A4 pada 96 dpi
const MAX_SCALE = 3;
const MAX_PIXELS = 12_000_000;  // aman untuk batas canvas iOS/Android

export async function exportToPng(elementId, filename) {
  const source = document.getElementById(elementId);
  if (!source) {
    alert('Elemen nota tidak ditemukan.');
    return;
  }

  if (typeof window.html2canvas !== 'function') {
    alert('Library html2canvas belum siap. Pastikan koneksi internet aktif.');
    return;
  }

  const host = document.createElement('div');
  host.className = 'nota-export-host';
  host.setAttribute('aria-hidden', 'true');

  const stage = document.createElement('div');
  stage.className = 'nota-stage';

  const clone = source.cloneNode(true);
  clone.removeAttribute('id');

  stage.appendChild(clone);
  host.appendChild(stage);
  document.body.appendChild(host);

  try {
    await ensureImagesLoaded(clone);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    const rect = clone.getBoundingClientRect();
    const area = Math.max(1, rect.width * rect.height);
    const scale = Math.max(1, Math.min(MAX_SCALE, Math.sqrt(MAX_PIXELS / area)));

    const canvas = await window.html2canvas(clone, {
      scale,
      width: EXPORT_WIDTH,
      windowWidth: EXPORT_WIDTH,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Host ada di luar layar; pindahkan ke origin pada dokumen kloning
        const clonedHost = clonedDoc.querySelector('.nota-export-host');
        if (clonedHost) {
          clonedHost.style.left = '0';
          clonedHost.style.top = '0';
        }
      }
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Canvas tidak dapat dikonversi ke PNG.');

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename || 'Nota.png';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error('Gagal mengeksport nota ke PNG:', err);
    alert('Terjadi kesalahan saat mengunduh gambar nota.');
  } finally {
    host.remove();
  }
}

export function triggerPrint() {
  window.print();
}
