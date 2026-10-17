// Form Binding & Event Listeners Editor

import { store } from './state.js';
import { APP_CONFIG, getBrandSlug, formatRupiah } from './config.js';

export function initForm() {
  const notaSeqInput = document.getElementById('input-nota-seq');
  const notaPrefixLabel = document.getElementById('label-nota-prefix');
  const dateInput = document.getElementById('input-date');
  const typeOptions = document.querySelectorAll('.segmented-option');
  const submittedByInput = document.getElementById('input-submitted-by');
  const itemsContainer = document.getElementById('items-editor-list');
  const btnAddItem = document.getElementById('btn-add-item');
  const notesInput = document.getElementById('input-notes');

  const state = store.getState();
  const yr = new Date().getFullYear();
  const slug = getBrandSlug(state.company?.brand?.name);

  if (notaPrefixLabel) notaPrefixLabel.textContent = `${slug}/${yr}/`;
  if (notaSeqInput) notaSeqInput.value = state.sequence;
  if (dateInput) dateInput.value = state.date;
  if (submittedByInput) submittedByInput.value = state.submittedBy || '';
  if (notesInput) notesInput.value = state.notes;

  if (notaSeqInput) {
    notaSeqInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) store.dispatch({ type: 'SET_SEQUENCE', value: val });
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'date', value: e.target.value });
    });
  }

  if (submittedByInput) {
    submittedByInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'submittedBy', value: e.target.value });
    });
  }

  const markActiveType = (type) => {
    typeOptions.forEach(opt => {
      const isSel = opt.getAttribute('data-type') === type;
      opt.classList.toggle('active', isSel);
      opt.setAttribute('aria-pressed', String(isSel));
    });
  };
  markActiveType(state.type);

  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      store.dispatch({ type: 'SET_TYPE', value: opt.getAttribute('data-type') });
    });
  });

  if (notesInput) {
    notesInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'notes', value: e.target.value });
    });
  }

  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      store.dispatch({ type: 'ADD_ITEM' });
      const rows = itemsContainer.querySelectorAll('.item-row');
      const lastRow = rows[rows.length - 1];
      if (lastRow) lastRow.querySelector('.item-name').focus();
    });
  }

  APP_CONFIG.SIGNATURE_KEYS.forEach(key => {
    const chk = document.getElementById(`chk-sig-${key}`);
    if (chk) {
      chk.checked = state.signatures[key];
      chk.addEventListener('change', (e) => {
        store.dispatch({ type: 'TOGGLE_SIGNATURE', key, value: e.target.checked });
      });
    }
  });

  store.subscribe((newState) => {
    const currentYr = new Date().getFullYear();
    const currentSlug = getBrandSlug(newState.company?.brand?.name);
    if (notaPrefixLabel) notaPrefixLabel.textContent = `${currentSlug}/${currentYr}/`;
    if (notaSeqInput && Number(notaSeqInput.value) !== newState.sequence) notaSeqInput.value = newState.sequence;
    if (dateInput && dateInput.value !== newState.date) dateInput.value = newState.date;
    if (submittedByInput && submittedByInput.value !== (newState.submittedBy || '')) {
      submittedByInput.value = newState.submittedBy || '';
    }
    if (notesInput && notesInput.value !== newState.notes) notesInput.value = newState.notes;

    markActiveType(newState.type);

    APP_CONFIG.SIGNATURE_KEYS.forEach(key => {
      const chk = document.getElementById(`chk-sig-${key}`);
      if (chk) chk.checked = newState.signatures[key];
    });

    syncItemsEditor(newState.items, itemsContainer);
  });

  syncItemsEditor(state.items, itemsContainer);
}

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
      <label class="item-field item-field-name">
        <span>Nama item</span>
        <input type="text" class="form-input item-name" placeholder="Contoh: Kardus" aria-label="Nama item ${index + 1}" autocomplete="off" enterkeyhint="next" value="${escapeHtml(item.name)}">
      </label>
      <button type="button" class="btn-remove-item" aria-label="Hapus item ${index + 1}" title="Hapus item">
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

    nameInput.addEventListener('input', (e) => store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'name', value: e.target.value }));
    qtyInput.addEventListener('input', (e) => store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'qty', value: Number(e.target.value) || 0 }));
    priceInput.addEventListener('input', (e) => store.dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'price', value: Number(e.target.value) || 0 }));

    [qtyInput, priceInput].forEach(input => input.addEventListener('focus', () => input.select()));
    btnRemove.addEventListener('click', () => store.dispatch({ type: 'REMOVE_ITEM', id: item.id }));

    container.appendChild(row);
  });
}

function updateItemRows(items, container) {
  items.forEach(item => {
    const row = container.querySelector(`.item-row[data-id="${item.id}"]`);
    if (!row) return;

    [['.item-name', item.name], ['.item-qty', item.qty], ['.item-price', item.price]].forEach(([sel, val]) => {
      const input = row.querySelector(sel);
      if (input && document.activeElement !== input && input.value !== String(val)) input.value = val;
    });

    const subtotalEl = row.querySelector('.item-subtotal-value');
    if (subtotalEl) subtotalEl.textContent = formatRupiah((item.qty || 0) * (item.price || 0));
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
