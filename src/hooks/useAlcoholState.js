// src/hooks/useAlcoholState.js
import { useState, useEffect, useMemo } from "react";
import { saveState, loadState } from "../utils/storage";
import {
  calcGrams,
  calcBurnRate,
  calcDistribution,
  calcDecayed,
  secondsToTarget,
  stageInfo,
  C_AT_100,
} from "../utils/alcoholCalc";

export function useAlcoholState() {
  // ----- プロ基本情報 -----
  const [isPro, setIsPro] = useState(false);

  // ----- 基本ステート -----
  const [history, setHistory] = useState([]);
  const [weightKg, setWeightKg] = useState(75);
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("male");

  // ----- アルコール状態 -----
  const [A_g, setAg] = useState(0);
  const [lastTs, setLastTs] = useState(Date.now());
  const [lastAlcoholTs, setLastAlcoholTs] = useState(0);
  const [lastDrinkGrams, setLastDrinkGrams] = useState(0);

  // ----- ソフトドリンク -----
  const [waterBonusSec, setWaterBonusSec] = useState(0);
  const [waterFX, setWaterFX] = useState(false);

  // ----- ピッカー -----
  const [picker, setPicker] = useState({
    open: false,
    kind: null,
    label: "",
    ml: 0,
    abv: 0,
    sizeKey: null,
    note: "",
  });

  const [booted, setBooted] = useState(false); // 復元完了
  const [goodNightOpen, setGoodNightOpen] = useState(false);

  // ----- save/load -----
  useEffect(() => {
    const saved = loadState();
    if (!saved) {
      setBooted(true);
      return;
    }

    setHistory(saved.history ?? []);
    setWeightKg(saved.weightKg ?? 75);
    setAge(saved.age ?? 35);
    setSex(saved.sex ?? "male");

    // burnRate を元に自然減衰して復元
    const br = calcBurnRate(saved.sex ?? "male", saved.age ?? 35);
    const now = Date.now();
    const dt_h = (now - (saved.lastTs ?? now)) / 3600000;
    const decayed = Math.max(0, (saved.A_g ?? 0) - br * Math.max(dt_h, 0));

    setAg(decayed);
    setLastTs(now);
    setLastAlcoholTs(saved.lastAlcoholTs ?? 0);
    setLastDrinkGrams(saved.lastDrinkGrams ?? 0);
    setWaterBonusSec(saved.waterBonusSec ?? 0);

    setIsPro(saved.isPro ?? false);

    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;

    const id = setTimeout(() => {
      saveState({
        A_g,
        lastTs,
        history,
        lastAlcoholTs,
        lastDrinkGrams,
        waterBonusSec,
        weightKg,
        age,
        sex,
        isPro,
      });
    }, 200);

    return () => clearTimeout(id);
  }, [
    booted,
    A_g,
    lastTs,
    history,
    lastAlcoholTs,
    lastDrinkGrams,
    waterBonusSec,
    weightKg,
    age,
    sex,
    isPro,
  ]);

  // --------------------------------------------------------------------
  //  アルコール計算系
  // --------------------------------------------------------------------

  const r = useMemo(() => calcDistribution(sex), [sex]);
  const burnRate = useMemo(() => calcBurnRate(sex, age), [sex, age]);

  // nowSec は useTimer.js 側で管理
  const computeA = (nowSec) => calcDecayed(A_g, lastTs, burnRate, nowSec);

  const computeScore = (A_now) => {
    const C = r > 0 && weightKg > 0 ? A_now / (r * weightKg) : 0;
    const score = Math.max(0, Math.min(100, (C / C_AT_100) * 100));
    return { scoreExact: score, score100: Math.round(score) };
  };

  // --------------------------------------------------------------------
  //  飲酒処理
  // --------------------------------------------------------------------
  const addDrink = (label, ml, abv) => {
    if (history[0]?.type === "alcohol") return; // ゲート時は NG

    const now = Date.now();
    const grams = calcGrams(ml, abv);

    setAg((a) => a + grams);
    setLastTs(now);
    setLastAlcoholTs(now);
    setLastDrinkGrams(grams);
    setWaterBonusSec(0);

    setHistory((h) => [
      {
        id: Math.random().toString(36).slice(2),
        ts: now,
        type: "alcohol",
        label,
        abv,
        ml,
      },
      ...h,
    ]);
  };

  const addWater = () => {
    const now = Date.now();
    const mandatory = history[0]?.type === "alcohol";

    setHistory((h) => [
      {
        id: Math.random().toString(36).slice(2),
        ts: now,
        type: "water",
        label: "ソフトドリンク/水",
      },
      ...h,
    ]);

    if (mandatory) {
      // エフェクト
      setWaterFX(true);
      setTimeout(() => setWaterFX(false), 1200);
    } else {
      setWaterBonusSec((s) => s + 600);
    }
  };

  // --------------------------------------------------------------------
  //  Drink Picker
  // --------------------------------------------------------------------
  const openDrinkPicker = (kind) => {
    if (history[0]?.type === "alcohol") return;
    setPicker((p) => ({ ...p, open: true, kind }));
  };

  const closePicker = () =>
    setPicker((p) => ({
      ...p,
      open: false,
    }));

  const confirmPicker = () => {
    if (!picker.label) return;
    addDrink(picker.label, Number(picker.ml), Number(picker.abv));
    closePicker();
  };

  // --------------------------------------------------------------------
  //  セッション終了
  // --------------------------------------------------------------------
  const endSession = () => {
    setAg(0);
    setLastTs(Date.now());
    setHistory([]);
    setWaterBonusSec(0);
    setLastAlcoholTs(0);
    setLastDrinkGrams(0);

    try {
      localStorage.removeItem("nomel_v1");
    } catch (_) {}

    setGoodNightOpen(true);
  };

  // --------------------------------------------------------------------
  //  外部に返す
  // --------------------------------------------------------------------
  return {
    // 状態
    isPro,
    setIsPro,
    history,
    setHistory,

    weightKg,
    setWeightKg,
    age,
    setAge,
    sex,
    setSex,

    A_g,
    computeA,
    computeScore,
    burnRate,
    r,

    lastAlcoholTs,
    lastDrinkGrams,
    waterBonusSec,

    picker,
    setPicker,
    openDrinkPicker,
    closePicker,
    confirmPicker,

    waterFX,
    goodNightOpen,
    setGoodNightOpen,

    // 操作系
    addDrink,
    addWater,
    endSession,

    needsWater: (history[0]?.type === "alcohol"),
  };
}
