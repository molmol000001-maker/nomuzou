// src/utils/storage.js

const STORAGE_KEY = "nomel_v1";

/**
 * 状態を localStorage に保存する
 * エラーが出てもアプリが止まらないように try/catch で保護
 */
export function saveState(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("saveState failed:", e);
  }
}

/**
 * 状態を localStorage から読み込む
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("loadState failed:", e);
    return null;
  }
}

/**
 * セッション終了時など、完全に削除したい時用
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("clearState failed:", e);
  }
}
