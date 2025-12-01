import { useState, useEffect, useMemo } from "react";
import { saveState, loadState } from "../utils/storage";

export function useAlcoholState() {
  const [history, setHistory] = useState([]);
  const [A_g, setAg] = useState(0);
  const [lastTs, setLastTs] = useState(Date.now());
  const [waterBonusSec, setWaterBonusSec] = useState(0);
  const [lastAlcoholTs, setLastAlcoholTs] = useState(0);
  const [lastDrinkGrams, setLastDrinkGrams] = useState(0);
  const [weightKg, setWeightKg] = useState(75);
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("male");
  const [booted, setBooted] = useState(false);

  // ← loadState() の復元と saveState() の保存をここに集約
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setHistory(saved.history ?? []);
      setAg(saved.A_g ?? 0);
      setLastTs(Date.now());
      setWaterBonusSec(saved.waterBonusSec ?? 0);
      setLastAlcoholTs(saved.lastAlcoholTs ?? 0);
      setLastDrinkGrams(saved.lastDrinkGrams ?? 0);

      setWeightKg(saved.weightKg ?? 75);
      setAge(saved.age ?? 35);
      setSex(saved.sex ?? "male");
    }
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const id = setTimeout(() => {
      saveState({
        A_g, lastTs, history,
        waterBonusSec, lastAlcoholTs, lastDrinkGrams,
        weightKg, age, sex,
      });
    }, 200);
    return () => clearTimeout(id);
  }, [booted, A_g, lastTs, history, waterBonusSec, lastAlcoholTs, lastDrinkGrams, weightKg, age, sex]);

  return {
    history, setHistory,
    A_g, setAg,
    lastTs, setLastTs,
    waterBonusSec, setWaterBonusSec,
    lastAlcoholTs, setLastAlcoholTs,
    lastDrinkGrams, setLastDrinkGrams,
    weightKg, setWeightKg,
    age, setAge,
    sex, setSex,
  };
}
