// Preloading & Handling Tanda Tangan

import { APP_CONFIG } from './config.js';

// Preload semua gambar tanda tangan & logo
export function preloadSignatureImages() {
  const assetsToPreload = [
    APP_CONFIG.BRAND_LOGO,
    ...Object.values(APP_CONFIG.SIGNATURE_ASSETS)
  ];

  const promises = assetsToPreload.map(src => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ src, status: 'loaded' });
      img.onerror = () => resolve({ src, status: 'error' });
      img.src = src;
    });
  });

  return Promise.all(promises);
}

// Ensure images are fully loaded before rendering or exporting
export function ensureImagesLoaded(containerElement) {
  const images = Array.from(containerElement.querySelectorAll('img'));
  const promises = images.map(img => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  });
  return Promise.all(promises);
}
