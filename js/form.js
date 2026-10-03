// Form Binding & Event Listeners Editor

import { store } from './state.js';
import { APP_CONFIG, getBrandSlug, formatRupiah } from './config.js';

export function initForm() {
  const notaSeqInput = document.getElementById('input-nota-seq');
  const notaPrefixLabel = document.getElementById('label-nota-prefix');
  const dateInput = document.getElementById('input-date');
  const typeOptions = document.querySelectorAll('.segmented-option');
  const itemsContainer = document.getElementById('items-editor-list');
  const btnAddItem = document.getElementById('btn-add-item');
  const notesInput = document.getElementById('input-notes');

  // Sync state ke form awal
  const state = store.getState();
  const currentYear = new Date().getFullYear();
  const brandSlug = getBrandSlug(state.company?.brand?.name);

  if (notaPrefixLabel) {
    notaPrefixLabel.textContent = `${brandSlug}/${currentYear}/`;
  }
  if (notaSeqInput) {
    notaSeqInput.value = state.sequence;
  }
  if (dateInput) dateInput.value = state.date;
  if (notesInput) notesInput.value = state.notes;

  // Listeners input sequence
  if (notaSeqInput) {
    notaSeqInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        store.dispatch({ type: 'SET_SEQUENCE', value: val });
      }
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'date', value: e.target.value });
    });
  }

  // Segmented Control Transaksi
  const markActiveType = (type) => {
    typeOptions.forEach(opt => {
      const isSelected = opt.getAttribute('data-type') === type;
      opt.classList.toggle('active', isSelected);
      opt.setAttribute('aria-pressed', String(isSelected));
    });
  };
  markActiveType(state.type);

  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      store.dispatch({ type: 'SET_TYPE', value: opt.getAttribute('data-type') });
    });
  });

  // Notes Textarea
  if (notesInput) {
    notesInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'notes', value: e.target.value });
    });
  }

  // Tambah Item Baris Baru
  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      store.dispatch({ type: 'ADD_ITEM' });
      // Fokus ke nama item baru agar langsung bisa mengetik
      const rows = itemsContainer.querySelectorAll('.item-row');
      const lastRow = rows[rows.length - 1];
      if (lastRow) lastRow.querySelector('.item-name').focus();
    });
  }

  // Signature Toggles
  APP_CONFIG.SIGNATURE_KEYS.forEach(key => {
    const chk = document.getElementById(`chk-sig-${key}`);
    if (chk) {
      chk.checked = state.signatures[key];
      chk.addEventListener('change', (e) => {
        store.dispatch({ type: 'TOGGLE_SIGNATURE', key, value: e.target.checked });
      });
    }
  });

  // Subscribe update untuk sync UI form saat state berubah
  store.subscribe((newState) => {
    const yr = new Date().getFullYear();
    const slug = getBrandSlug(newState.company?.brand?.name);
    if (notaPrefixLabel) {
      notaPrefixLabel.textContent = `${slug}/${yr}/`;
    }
    if (notaSeqInput && Number(notaSeqInput.value) !== newState.sequence) {
      notaSeqInput.value = newState.sequence;
    }
    if (dateInput && dateInput.value !== newState.date) {
      dateInput.value = newState.date;
    }
    if (notesInput && notesInput.value !== newState.notes) {
      notesInput.value = newState.notes;
    }

    markActiveType(newState.type);

    APP_CONFIG.SIGNATURE_KEYS.forEach(key => {
      const chk = document.getElementById(`chk-sig-${key}`);
      if (chk) chk.checked = newState.signatures[key];
    });

    syncItemsEditor(newState.items, itemsContainer);
  });

  // Initial render item editor list
  syncItemsEditor(state.items, itemsContainer);
}

// Editor item: baris hanya dibangun ulang saat daftar item berubah (tambah/hapus/ganti).
// Ketikan biasa hanya memperbarui nilai di tempat, sehingga fokus dan keyboard HP tidak hilang.
let renderedItemsKey = null;

function syncItemsEditor(items, container) {
  if (!container) return;
  const key = items.map(item => item.id).join(',');

  if (key !== renderedItemsKey) {
    buildItemsEditor(items, container);
    renderedItemsKey = key;
  } else {
    updateItemRows(items, container);
  }
}

function buildItemsEditor(items, container) {
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p class="items-empty">Belum ada item. Ketuk Tambah item untuk memulai.</p>';
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.dataset.id = item.id;

    row.innerHTML = `
      <input type="text" class="form-input item-name" placeholder="Nama item" aria-label="Nama item ${index + 1}" autocomplete="off" enterkeyhint="next" value="${escapeHtml(item.name)}">
      <button type="button" class="btn-remove-item" aria-label="Hapus item ${index + 1}">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
      </button>
      <label class="item-field item-field-qty">
        <span>Qty</span>
        <input type="number" class="form-input item-qty" min="0" step="any" inputmode="decimal" enterkeyhint="next" value="${item.qty}">
      </label>
      <label class="item-field item-field-price">
        <span>Harga satuan</span>
        <div class="input-affix">
          <span aria-hidden="true">Rp</span>
          <input type="number" class="form-input item-price" min="0" inputmode="numeric" enterkeyhint="done" value="${item.price}">
        </div>
      </label>
      <div class="item-subtotal">
        <span>Subtotal</span>
        <output class="item-subtotal-value">${formatRupiah((item.qty || 0) * (item.price || 0))}</output>
      </div>
    `;

    const nameInput = row.querySelector('.item-name');
    const qtyInput = row.querySelector('.item-qty');
    const priceInput = row.querySelector('.item-price');
    const btnRemove = row.querySelector('.btn-remove-item');

    nameInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'name', value: e.target.value });
    });

    qtyInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'qty', value: Number(e.target.value) || 0 });
    });

    priceInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'price', value: Number(e.target.value) || 0 });
    });

    // Pilih seluruh isi saat fokus agar angka 0 / 1 mudah diganti
    [qtyInput, priceInput].forEach(input => {
      input.addEventListener('focus', () => input.select());
    });

    btnRemove.addEventListener('click', () => {
      store.dispatch({ type: 'REMOVE_ITEM', id: item.id });
    });

    container.appendChild(row);
  });
}

function updateItemRows(items, container) {
  items.forEach(item => {
    const row = container.querySelector(`.item-row[data-id="${item.id}"]`);
    if (!row) return;

    const fields = [
      ['.item-name', item.name],
      ['.item-qty', item.qty],
      ['.item-price', item.price]
    ];

    fields.forEach(([selector, value]) => {
      const input = row.querySelector(selector);
      // Jangan timpa kolom yang sedang diketik
      if (input && document.activeElement !== input && input.value !== String(value)) {
        input.value = value;
      }
    });

    const subtotalEl = row.querySelector('.item-subtotal-value');
    if (subtotalEl) {
      subtotalEl.textContent = formatRupiah((item.qty || 0) * (item.price || 0));
    }
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
