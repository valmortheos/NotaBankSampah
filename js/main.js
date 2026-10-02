// Bootstrap & Event Wiring Utama

import { store } from './state.js';
import { initForm } from './form.js';
import { renderNotaPreview } from './render.js';
import { preloadSignatureImages } from './signature.js';
import { exportToPng, triggerPrint } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
  const previewContainer = document.getElementById('preview-container');
  const btnReset = document.getElementById('btn-reset');
  const btnDownload = document.getElementById('btn-download');
  const btnPrint = document.getElementById('btn-print');

  // Preload assets
  preloadSignatureImages();

  // Inisialisasi Form
  initForm();

  // Initial Render Preview
  renderNotaPreview(store.getState(), previewContainer);

  // Re-render preview setiap kali state berubah
  store.subscribe((state) => {
    renderNotaPreview(state, previewContainer);
  });

  // Action Reset dengan Konfirmasi
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengosongkan/mereset formulir nota?')) {
        store.dispatch({ type: 'RESET' });
      }
    });
  }

  // Action Unduh PNG
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const state = store.getState();
      const notaNoClean = (state.notaNo || 'DRAFT').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Nota-${notaNoClean}.png`;
      exportToPng('nota-card-element', filename);
    });
  }

  // Action Cetak
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      triggerPrint();
    });
  }
});
