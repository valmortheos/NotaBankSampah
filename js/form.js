// Form Binding & Event Listeners Editor

import { store } from './state.js';
import { APP_CONFIG } from './config.js';

export function initForm() {
  const notaNoInput = document.getElementById('input-nota-no');
  const dateInput = document.getElementById('input-date');
  const typeOptions = document.querySelectorAll('.segmented-option');
  const itemsContainer = document.getElementById('items-editor-list');
  const btnAddItem = document.getElementById('btn-add-item');
  const notesInput = document.getElementById('input-notes');

  // Sync state ke form awal
  const state = store.getState();
  if (notaNoInput) notaNoInput.value = state.notaNo;
  if (dateInput) dateInput.value = state.date;
  if (notesInput) notesInput.value = state.notes;

  // Header meta inputs
  if (notaNoInput) {
    notaNoInput.addEventListener('input', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'notaNo', value: e.target.value });
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      store.dispatch({ type: 'SET_FIELD', field: 'date', value: e.target.value });
    });
  }

  // Segmented Control Transaksi
  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      typeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const selectedType = opt.getAttribute('data-type');
      store.dispatch({ type: 'SET_TYPE', value: selectedType });
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

  // Subscribe update untuk sync UI form saat Reset
  store.subscribe((newState) => {
    if (notaNoInput && notaNoInput.value !== newState.notaNo) {
      notaNoInput.value = newState.notaNo;
    }
    if (dateInput && dateInput.value !== newState.date) {
      dateInput.value = newState.date;
    }
    if (notesInput && notesInput.value !== newState.notes) {
      notesInput.value = newState.notes;
    }

    typeOptions.forEach(opt => {
      const isSelected = opt.getAttribute('data-type') === newState.type;
      opt.classList.toggle('active', isSelected);
    });

    APP_CONFIG.SIGNATURE_KEYS.forEach(key => {
      const chk = document.getElementById(`chk-sig-${key}`);
      if (chk) chk.checked = newState.signatures[key];
    });

    renderItemsEditor(newState.items, itemsContainer);
  });

  // Initial render item editor list
  renderItemsEditor(state.items, itemsContainer);
}

// Render dynamic rows item editor
function renderItemsEditor(items, container) {
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'item-row';

    row.innerHTML = `
      <input type="text" class="form-input item-name" placeholder="Nama item" value="${escapeHtml(item.name)}">
      <input type="number" class="form-input item-qty" min="1" value="${item.qty}">
      <input type="number" class="form-input item-price" min="0" value="${item.price}">
      <button type="button" class="btn-remove-item" title="Hapus Item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
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

    btnRemove.addEventListener('click', () => {
      store.dispatch({ type: 'REMOVE_ITEM', id: item.id });
    });

    container.appendChild(row);
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
