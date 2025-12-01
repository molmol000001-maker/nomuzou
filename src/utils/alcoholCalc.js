// src/utils/alcoholCalc.js

// -------------------------------------------------------------
// 定数
// -------------------------------------------------------------

// “100 点時の血中濃度” の校正値（App.jsx と同じ値）
export const C_AT_100 = 0.745;

// -------------------------------------------------------------
// 基本計算
// -------------------------------------------------------------

/**
 * ml と 度数(%) からアルコール量（g）を求める
 * 公式: ml * (abv/100) * 0.8
 */
export function calcGrams(ml, abv) {
  return ml * (abv / 100) * 0.8;
}

/**
 * 性別 → 分布係数 r
 */
export function calcDistribution(sex) {
  if (sex === "male") return 0.68;
  if (sex === "female") return 0.55;
  return 0.62; // other
}

/**
 * 性別 + 年齢 → 代謝速度 burnRate (g/h)
 * App.jsx のロジックを完全移植（30歳未満+0.2, 60歳以上-0.2）
 */
export function calcBurnRate(sex, age) {
  let v = sex === "male" ? 7.2 : sex === "female" ? 6.8 : 7.0;

  if (age < 30) v += 0.2;
  else if (age >= 60) v -= 0.2;

  return Math.max(3, Math.min(12, Number(v.toFixed(1))));
}

/**
 * A_g の自然減衰
 * lastTs から nowSec までの時間を元に計算
 */
export function calcDecayed(A_g, lastTs, burnRate, nowSec) {
  const dt_h = Math.max(0, (nowSec - lastTs) / 3600000);
  return Math.max(0, A_g - burnRate * dt_h);
}

// -------------------------------------------------------------
// 目標スコア（次の1杯OK判定）関係
// -------------------------------------------------------------

/**
 * 目標スコアに対して自然減衰で到達するまでの秒数
 */
export function secondsToTarget(A_now, A_target, burnRate) {
  if (A_now <= A_target) return 0;

  const over = A_now - A_target;
  const hours = over / Math.max(0.0001, burnRate);

  return Math.ceil(hours * 3600);
}

// -------------------------------------------------------------
// ステージ判定（酔い度ラベル）
// -------------------------------------------------------------

export function stageInfo(score100) {
  if (score100 < 15) return { label: "しらふ", bar: "bg-gray-400" };
  if (score100 < 45) return { label: "ほろ酔い", bar: "bg-green-500" };
  if (score100 < 75) return { label: "パーティ", bar: "bg-sky-500" };
  if (score100 < 90) return { label: "酩酊", bar: "bg-amber-500" };
  return { label: "危険", bar: "bg-red-600" };
}
