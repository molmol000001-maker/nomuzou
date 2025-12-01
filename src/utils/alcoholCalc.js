// utils/alcoholCalc.js
export const gramsOfAlcohol = (abvPct, ml) =>
  ml * (abvPct / 100) * 0.8;

export const fmtMMSS = (s) => {
  const m = Math.floor(s / 60);
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${ss}`;
};
