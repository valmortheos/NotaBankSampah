// Modul Pengelolaan Persistensi Draft Formulir

import {
  STORAGE_KEYS,
  safeGetStorage,
  safeSetStorage,
  safeRemoveStorage,
  APP_CONFIG
} from './config.js';

let saveDebounceTimer = null;

// Menyimpan draft form ke localStorage dengan debounce 300ms
export function saveDraft(state) {
  if (!state) return;

  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  saveDebounceTimer = setTimeout(() => {
    try {
      const draftData = {
        date: state.date,
        type: state.type,
        items: state.items,
        notes: state.notes,
        signatures: state.signatures
      };
      safeSetStorage(STORAGE_KEYS.draft, JSON.stringify(draftData));
    } catch (err) {
      console.warn('Gagal menyimpan draft nota:', err);
    }
  }, 300);
}

// Membaca dan memvalidasi draft form dari localStorage
export function loadDraft() {
  const rawData = safeGetStorage(STORAGE_KEYS.draft, null);
  if (!rawData) return null;

  try {
    const parsed = JSON.parse(rawData);
    if (!parsed || typeof parsed !== 'object') {
      clearDraft();
      return null;
    }

    // Validasi field terstruktur
    const validatedDraft = {};

    if (typeof parsed.date === 'string') {
      validatedDraft.date = parsed.date;
    }

    if (Object.values(APP_CONFIG.TRANSACTION_TYPES).includes(parsed.type)) {
      validatedDraft.type = parsed.type;
    }

    if (Array.isArray(parsed.items)) {
      validatedDraft.items = parsed.items.map((item, idx) => ({
        id: item.id || Date.now() + idx,
        name: typeof item.name === 'string' ? item.name : '',
        qty: typeof item.qty === 'number' ? item.qty : Number(item.qty) || 0,
        price: typeof item.price === 'number' ? item.price : Number(item.price) || 0
      }));
    }

    if (typeof parsed.notes === 'string') {
      validatedDraft.notes = parsed.notes;
    }

    if (parsed.signatures && typeof parsed.signatures === 'object') {
      validatedDraft.signatures = {
        sekretaris: Boolean(parsed.signatures.sekretaris),
        bendahara: Boolean(parsed.signatures.bendahara),
        ketua: Boolean(parsed.signatures.ketua)
      };
    }

    return validatedDraft;
  } catch (err) {
    console.warn('Draft korup, membersihkan storage:', err);
    clearDraft();
    return null;
  }
}

// Menghapus draft dari localStorage
export function clearDraft() {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = null;
  }
  safeRemoveStorage(STORAGE_KEYS.draft);
}
