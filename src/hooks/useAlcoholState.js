// src/hooks/useAlcoholState.js
import { useEffect, useMemo, useReducer, useCallback, useRef } from "react";
import { saveState, loadState } from "../utils/storage";

const STORAGE_KEY = "nomel_v1";

/* =========================
   pure helpers
========================= */
function calcBurnRate(sex, age) {
  let v = sex === "male" ? 7.2 : 6.8;
  if (age < 30) v += 0.2;
  if (age >= 60) v -= 0.2;
  return Math.max(3, Math.min(12, v));
}

function calcA_now(A_g, lastTs, nowMs, burnRate) {
  const dt_h = Math.max(0, (nowMs - lastTs) / 3600000);
  return Math.max(0, A_g - burnRate * dt_h);
}

/* =========================
   initial state
========================= */
const initial = {
  booted: false,

  // alcohol core
  A_g: 0,
  lastTs: Date.now(),
  history: [],
  waterBonusSec: 0,
  lastAlcoholTs: 0,
  lastDrinkGrams: 0,

  // user
  weightKg: 75,
  age: 35,
  sex: "male",
};

/* =========================
   reducer
========================= */
function reducer(state, action) {
  switch (action.type) {
    case "BOOT": {
      return { ...state, ...action.payload, booted: true };
    }

    case "SET_USER": {
      const p = action.payload || {};
      const next = { ...state };

      if ("weightKg" in p) {
        const n = Number(p.weightKg);
        if (Number.isFinite(n)) next.weightKg = n;
      }
      if ("age" in p) {
        const n = Number(p.age);
        if (Number.isFinite(n)) next.age = n;
      }
      if ("sex" in p) {
        next.sex = p.sex;
      }
      return next;
    }

    case "SET_HISTORY": {
      return { ...state, history: action.history };
    }

    // ★ 핵심：加算前に「今時点の残量」に焼く
    case "ADD_DRINK": {
      const { nowMs, grams, entry } = action;
      const burnRate = calcBurnRate(state.sex, state.age);

      const A_before = calcA_now(state.A_g, state.lastTs, nowMs, burnRate);
      const A_after = A_before + grams;

      return {
        ...state,
        A_g: A_after,
        lastTs: nowMs,
        lastAlcoholTs: nowMs,
        lastDrinkGrams: grams,
        waterBonusSec: 0,
        history: [entry, ...state.history],
      };
    }

    case "ADD_WATER": {
      const { entry, mandatory } = action;
      return {
        ...state,
        history: [entry, ...state.history],
        waterBonusSec: mandatory
          ? state.waterBonusSec
          : state.waterBonusSec + 600,
      };
    }

    case "END_SESSION": {
      const nowMs = action.nowMs;
      return {
        ...state,
        A_g: 0,
        lastTs: nowMs,
        history: [],
        waterBonusSec: 0,
        lastAlcoholTs: 0,
        lastDrinkGrams: 0,
      };
    }

    default:
      return state;
  }
}

/* =========================
   hook
========================= */
export default function useAlcoholState(nowMs) {
  const [state, dispatch] = useReducer(reducer, initial);

  // 最新 state を参照するため
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* ---- load ---- */
  useEffect(() => {
    const saved = loadState();
    if (!saved) {
      dispatch({ type: "BOOT", payload: {} });
      return;
    }

    dispatch({
      type: "BOOT",
      payload: {
        A_g: Number(saved.A_g ?? 0),
        lastTs: Number(saved.lastTs ?? Date.now()),
        history: Array.isArray(saved.history) ? saved.history : [],
        waterBonusSec: Number(saved.waterBonusSec ?? 0),
        lastAlcoholTs: Number(saved.lastAlcoholTs ?? 0),
        lastDrinkGrams: Number(saved.lastDrinkGrams ?? 0),
        weightKg: Number(saved.weightKg ?? 75),
        age: Number(saved.age ?? 35),
        sex: saved.sex ?? "male",
      },
    });
  }, []);

  /* ---- save ---- */
  useEffect(() => {
    if (!state.booted) return;

    const id = setTimeout(() => {
      const s = stateRef.current;
      saveState({
        A_g: s.A_g,
        lastTs: s.lastTs,
        history: s.history,
        waterBonusSec: s.waterBonusSec,
        lastAlcoholTs: s.lastAlcoholTs,
        lastDrinkGrams: s.lastDrinkGrams,
        weightKg: s.weightKg,
        age: s.age,
        sex: s.sex,
      });
    }, 200);

    return () => clearTimeout(id);
  }, [
    state.booted,
    state.A_g,
    state.lastTs,
    state.history,
    state.waterBonusSec,
    state.lastAlcoholTs,
    state.lastDrinkGrams,
    state.weightKg,
    state.age,
    state.sex,
  ]);

  /* ---- derived ---- */
  const burnRate = useMemo(
    () => calcBurnRate(state.sex, state.age),
    [state.sex, state.age]
  );

  const A_now = useMemo(
    () => calcA_now(state.A_g, state.lastTs, nowMs, burnRate),
    [state.A_g, state.lastTs, nowMs, burnRate]
  );

  const scoreExact = Math.min(100, A_now * 2);

  const stage = useMemo(() => {
    if (A_now < 3) return { label: "シラフ", bar: "bg-emerald-500" };
    if (A_now < 10) return { label: "ほろ酔い", bar: "bg-lime-500" };
    if (A_now < 20) return { label: "パーティー", bar: "bg-yellow-500" };
    if (A_now < 30) return { label: "酔い", bar: "bg-orange-500" };
    if (A_now < 40) return { label: "ベロベロ", bar: "bg-red-500" };
    return { label: "危険", bar: "bg-red-700" };
  }, [A_now]);

  const nextOkSec = useMemo(() => {
    const target = 15;
    const need = A_now - target;
    if (need <= 0) return 0;
    const sec = (need / burnRate) * 3600 - state.waterBonusSec;
    return Math.max(0, Math.floor(sec));
  }, [A_now, burnRate, state.waterBonusSec]);

  /* ---- actions ---- */
  const addDrink = useCallback((label, ml, abv) => {
    const grams = ml * (abv / 100) * 0.8;
    const now = Date.now();
    dispatch({
      type: "ADD_DRINK",
      nowMs: now,
      grams,
      entry: {
        id: Math.random().toString(36),
        ts: now,
        type: "alcohol",
        label,
        ml,
        abv,
      },
    });
  }, []);

  const addWater = useCallback((mandatory) => {
    const now = Date.now();
    dispatch({
      type: "ADD_WATER",
      mandatory: !!mandatory,
      entry: {
        id: Math.random().toString(36),
        ts: now,
        type: "water",
        label: "ソフトドリンク/水",
      },
    });
  }, []);

  const endSession = useCallback(() => {
    const now = Date.now();
    dispatch({ type: "END_SESSION", nowMs: now });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const setHistory = useCallback((updater) => {
    dispatch({
      type: "SET_HISTORY",
      history:
        typeof updater === "function"
          ? updater(stateRef.current.history)
          : updater,
    });
  }, []);

  const setUser = useCallback((payload) => {
    dispatch({ type: "SET_USER", payload });
  }, []);

  return {
    // state
    history: state.history,
    A_now,
    burnRate,
    nextOkSec,
    waterBonusSec: state.waterBonusSec,
    lastAlcoholTs: state.lastAlcoholTs,
    lastDrinkGrams: state.lastDrinkGrams,

    weightKg: state.weightKg,
    age: state.age,
    sex: state.sex,

    // ui helpers
    stage,
    scoreExact,

    // actions
    addDrink,
    addWater,
    endSession,
    setHistory,
    setUser,
  };
}
