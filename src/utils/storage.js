// utils/storage.js
const STORAGE_KEY = "nomel_v1";

export const saveState = (obj) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
  catch (_) {}
};

export const loadState = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch (_) {
    return null;
  }
};
