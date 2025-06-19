// Ensure the global lov object exists to prevent runtime errors from external scripts
interface LovGlobal {
  [key: string]: unknown;
}

declare global {
  interface Window {
    lov?: LovGlobal;
  }
  // Allow accessing `lov` on `globalThis` in non-browser environments
  /* eslint-disable no-var */
  var lov: LovGlobal | undefined;
  /* eslint-enable no-var */
}

const globalTarget = (typeof globalThis !== "undefined" ? globalThis : {}) as {
  lov?: LovGlobal;
};

if (!globalTarget.lov) {
  globalTarget.lov = {};
}
