// Ensure the global lov object exists to prevent runtime errors from external scripts
interface LovGlobal {
  [key: string]: unknown;
}

declare global {
  interface Window {
    lov?: LovGlobal;
  }
}

if (typeof window !== 'undefined') {
  window.lov = window.lov || {};
}
