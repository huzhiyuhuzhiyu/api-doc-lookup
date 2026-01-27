// plugins/unsaved-guard.js

const dirtyMap = new Map();

function updateGlobalListener() {
  const hasAnyDirty = Array.from(dirtyMap.values()).some(v => v);
  if (hasAnyDirty) {
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
  }
}

function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = '';
  return '';
}

export default {
  install(Vue, options = {}) {
    Vue.prototype.$unsavedGuard = {
      set(flag, fullPath = window.location.hash || window.location.pathname) {
        dirtyMap.set(fullPath, Boolean(flag));
        updateGlobalListener();
      },

      get(fullPath = window.location.hash || window.location.pathname) {
        return dirtyMap.get(fullPath) || false;
      },

      clear(fullPath) {
        dirtyMap.delete(fullPath);
        updateGlobalListener();
      },

      clearAll() {
        dirtyMap.clear();
        updateGlobalListener();
      },

      getAll() {
        return Object.fromEntries(dirtyMap);
      }
    };
  }
};
