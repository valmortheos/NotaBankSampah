// Rendering Preview Nota Real-time dari State

import {
  APP_CONFIG,
  formatRupiah,
  formatDateIndonesian,
  getBrandSlug,
  formatSequenceNumber,
  formatAddressLines
} from './config.js';

export function renderNotaPreview(state, container) {
  if (!container) return;

  const brand = state.company?.brand || {};
  const isIncome = state.type === APP_CONFIG.TRANSACTION_TYPES.INCOME;
  const badgeClass = isIncome ? 'pemasukan' : 'pengeluaran';
  const badgeLabel = isIncome ? 'PEMASUKAN' : 'PENGELUARAN';

  // Format No. Nota: <SLUG>/<YYYY>/<NNN>
  const brandSlug = getBrandSlug(brand.name);
  const currentYear = new Date().getFullYear();
  const seqFormatted = formatSequenceNumber(state.sequence);
  const fullNotaNo = `${brandSlug}/${currentYear}/${seqFormatted}`;

  let subtotal = 0;
  const tableRowsHtml = state.items.map((item, index) => {
    const itemTotal = (item.qty || 0) * (item.price || 0);
    subtotal += itemTotal;
    return `
      <tr>
        <td class="col-no">${index + 1}</td>
        <td class="col-item">${escapeHtml(item.name || '-')}</td>
        <td class="col-qty">${item.qty || 0}</td>
        <td class="col-price cell-amount">${formatRupiah(item.price || 0)}</td>
        <td class="col-total cell-amount">${formatRupiah(itemTotal)}</td>
      </tr>
    `;
  }).join('');

  const signaturesHtml = APP_CONFIG.SIGNATURE_KEYS.map(key => {
    const isActive = state.signatures[key];
    const roleTitle = APP_CONFIG.SIGNATURE_ROLES[key];
    const assetPath = APP_CONFIG.SIGNATURE_ASSETS[key];

    return `
      <div class="sig-box ${isActive ? 'active' : ''}">
        <span class="sig-role">${roleTitle}</span>
        <div class="sig-img-container">
          <img src="${assetPath}" alt="TDT ${roleTitle}" class="sig-img">
        </div>
        <div class="sig-line"></div>
        <span class="sig-placeholder">( ................. )</span>
      </div>
    `;
  }).join('');

  const notesHtml = state.notes && state.notes.trim() !== '' ? `
    <div class="nota-notes">
      <div class="notes-title">Catatan:</div>
      <div class="notes-content">${escapeHtml(state.notes)}</div>
    </div>
  ` : '';

  const addressFormatted = formatAddressLines(brand.address);

  container.innerHTML = `
    <div class="nota-card" id="nota-card-element">
      <div class="nota-kop">
        <div class="kop-brand">
          <img src="${APP_CONFIG.BRAND_LOGO}" alt="${brand.name || 'Logo'}" class="kop-logo">
          <div class="kop-text">
            <span class="kop-title">${brand.name || ''}</span>
            <span class="kop-subtitle">${brand.tagline || ''}</span>
            <div class="kop-address">${addressFormatted}</div>
          </div>
        </div>
        <div class="kop-badge-wrapper">
          <span class="transaction-badge ${badgeClass}">${badgeLabel}</span>
        </div>
      </div>

      <div class="nota-meta">
        <div class="meta-item">
          <span class="meta-label">NO. NOTA</span>
          <span class="meta-value">${fullNotaNo}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">TANGGAL</span>
          <span class="meta-value">${formatDateIndonesian(state.date)}</span>
        </div>
      </div>

      <div class="nota-table-wrapper">
        <table class="nota-table">
          <thead>
            <tr>
              <th class="col-no">NO</th>
              <th class="col-item">DESKRIPSI ITEM</th>
              <th class="col-qty">QTY</th>
              <th class="col-price">HARGA</th>
              <th class="col-total">JUMLAH</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml.length > 0 ? tableRowsHtml : `<tr><td colspan="5" class="empty-table-cell">Belum ada item</td></tr>`}
          </tbody>
          <tfoot>
            <tr class="grand-total">
              <td colspan="4" class="total-label-cell">TOTAL</td>
              <td class="col-total cell-amount total-value-cell">${formatRupiah(subtotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${notesHtml}

      <div class="nota-signatures">
        ${signaturesHtml}
      </div>

      <div class="nota-footer">
        ${brand.footer || ''}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
