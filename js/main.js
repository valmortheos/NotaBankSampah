// Bootstrap & Event Wiring Utama

import { store } from './state.js';
import { initForm } from './form.js';
import { renderNotaPreview } from './render.js';
import { preloadSignatureImages } from './signature.js';
import { exportToPng, triggerPrint } from './export.js';
import { FALLBACK_COMPANY, getBrandSlug, formatSequenceNumber } from './config.js';
import { loadDraft } from './persistence.js';

document.addEventListener('DOMContentLoaded', async () => {
  const previewContainer = document.getElementById('preview-container');
  const btnNewNote = document.getElementById('btn-new-note');
  const btnReset = document.getElementById('btn-reset');
  const btnDownload = document.getElementById('btn-download');
  const btnPrint = document.getElementById('btn-print');
  const mainContent = document.querySelector('.main-content');
  const viewTabs = document.querySelectorAll('.view-tab');

  // Load external JSON company config
  try {
    const res = await fetch('data/company.json');
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const companyData = await res.json();
    if (companyData && companyData.brand) {
      store.dispatch({ type: 'SET_COMPANY', value: companyData });
    }
  } catch (err) {
    console.warn('Gagal memuat data/company.json, menggunakan data fallback:', err);
    store.dispatch({ type: 'SET_COMPANY', value: FALLBACK_COMPANY });
  }

  // Hydrate draft tersimpan dari localStorage sebelum render pertama
  const savedDraft = loadDraft();
  if (savedDraft) {
    store.dispatch({ type: 'HYDRATE_DRAFT', value: savedDraft });
  }

  // Preload assets
  preloadSignatureImages();

  // Inisialisasi Form Editor
  initForm();

  // Initial Render Preview
  renderNotaPreview(store.getState(), previewContainer);

  // Re-render preview setiap kali state berubah
  store.subscribe((state) => {
    renderNotaPreview(state, previewContainer);
  });

  // Tab Isi nota / Pratinjau (mobile & tablet; di desktop tab disembunyikan CSS)
  const setView = (view) => {
    if (!mainContent) return;
    mainContent.dataset.view = view;
    viewTabs.forEach(tab => {
      const isActive = tab.dataset.view === view;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    });
    window.scrollTo({ top: 0 });
  };

  viewTabs.forEach(tab => {
    tab.addEventListener('click', () => setView(tab.dataset.view));
  });

  // Action Nota Baru (Increment sequence & reset form)
  if (btnNewNote) {
    btnNewNote.addEventListener('click', () => {
      store.dispatch({ type: 'NEW_NOTE' });
    });
  }

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
    btnDownload.addEventListener('click', async () => {
      const state = store.getState();
      const currentYear = new Date().getFullYear();
      const slug = getBrandSlug(state.company?.brand?.name);
      const seqFormatted = formatSequenceNumber(state.sequence);
      const notaNoClean = `${slug}_${currentYear}_${seqFormatted}`;
      const filename = `Nota-${notaNoClean}.png`;
      btnDownload.disabled = true;
      btnDownload.setAttribute('aria-busy', 'true');
      try {
        await exportToPng('nota-card-element', filename);
      } finally {
        btnDownload.disabled = false;
        btnDownload.removeAttribute('aria-busy');
      }
    });
  }

  // Action Cetak
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      triggerPrint();
    });
  }
});
