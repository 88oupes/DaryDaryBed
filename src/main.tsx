// Safe fetch compatibility and extension error shield
try {
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  let currentFetch = originalFetch;
  Object.defineProperty(window, 'fetch', {
    get: function() {
      return currentFetch;
    },
    set: function(fn) {
      currentFetch = fn;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

window.addEventListener('error', function(e) {
  if (e && ((e.filename && e.filename.startsWith('chrome-extension://')) || (e.message && e.message.includes('Cannot set property fetch')))) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return true;
  }
}, true);

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

