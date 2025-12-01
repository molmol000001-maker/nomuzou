import React, { useState, useEffect, useMemo, useRef } from "react";
import { saveState, loadState } from "./utils/storage";

import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import HistoryPanel from "./components/HistoryPanel";
import SettingsPanel from "./components/SettingsPanel";

import WaterGate from "./components/WaterGate";
import WaterFX from "./components/WaterFX";
import DrinkPicker from "./components/DrinkPicker";
import GoodNightOverlay from "./components/GoodNightOverlay";

import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------
// localStorage key
// ---------------------------------------------------------
const STORAGE_KEY = "nomel_v1";

// ---------------------------------------------------------
// App本体
// ---------------------------------------------------------
export default function App() {
  // UI states
  const [tab, setTab] = useState("main");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // timer
  const [nowSec, setNowSec] = useState(Date.now());

  // drink states
  const [history, setHistory] = useState([]);
  const [A_g, setAg] = useState(0);
  const [lastTs, setLastTs] = useState(Date.now());
  const [lastAlcoholTs, setLastAlcoholTs] = useState(0);
  const [lastDrinkGrams, setLastDrinkGrams] = useState(0);

  // profile states
  const [weightKg, setWeightKg] = useState(75);
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("male");

  // water bonus
  const [waterBonusSec, setWaterBonusSec] = useState(0);

  const [waterFX, setWaterFX] = useState(false);
  const [goodNightOpen, setGoodNightOpen] = useState(false);

  // picker
  const [picker, setPicker] = useState({
    open: false,
    kind: null,
    label: "",
    ml: 350,
    abv: 5,
    sizeKey: null,
    note: "",
  });

  const [booted, setBooted] = useState(false);

  // ---------------------------------------------------------
  // iOS ネイティブ連携
  // ---------------------------------------------------------
  useEffect(() => {
    window.proStatusUpdate = function (status) {
      setIsPro(status === "true");
    };
  }, []);

  // ---------------------------------------------------------
  // footerの高さ監視
  // ---------------------------------------------------------
  useEffect(() => {
    if (!footerRef.current) return;
    const el = footerRef.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setFooterHeight(rect.height);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // ---------------------------------------------------------
  // 状態復元
  // ---------------------------------------------------------
  useEffect(() => {
    const saved = loadState();
    if (!saved) {
      setBooted(true);
      return;
    }

    if (saved.isPro !== undefined) setIsPro(saved.isPro);

    if (saved.weightKg) setWeightKg(saved.weightKg);
    if (saved.age) setAge(saved.age);
    if (saved.sex) setSex(saved.sex);

    const calcBurn = (sx, ag) => {
      let v = sx === "male" ? 7.2 : sx === "female" ? 6.8 : 7.0;
      if (ag < 30) v += 0.2;
      else if (ag >= 60) v -= 0.2;
      return Math.max(3, Math.min(12, Number(v.toFixed(1))));
    };

    const now = Date.now();
    const last = Number(saved.lastTs ?? now);
    const dt_h = Math.max(0, (now - last) / 3600000);
    const burn = calcBurn(saved.sex ?? sex, saved.age ?? age);
    const Ag = Math.max(0, Number(saved.A_g ?? 0) - burn * dt_h);

    setAg(Ag);
    setLastTs(now);
    setHistory(Array.isArray(saved.history) ? saved.history : []);
    setWaterBonusSec(Number(saved.waterBonusSec ?? 0));
    setLastAlcoholTs(Number(saved.lastAlcoholTs ?? 0));
    setLastDrinkGrams(Number(saved.lastDrinkGrams ?? 0));

    setBooted(true);
  }, []);

  // ---------------------------------------------------------
  // 状態保存
  // ---------------------------------------------------------
  useEffect(() => {
    if (!booted) return;

    const id = setTimeout(() => {
      saveState({
        version: 1,
        isPro,
        A_g,
        lastTs,
        history,
        waterBonusSec,
        lastAlcoholTs,
        lastDrinkGrams,
        weightKg,
        age,
        sex,
      });
    }, 200);

    return () => clearTimeout(id);
  }, [
    booted,
    isPro,
    A_g,
    lastTs,
    history,
    waterBonusSec,
    lastAlcoholTs,
    lastDrinkGrams,
    weightKg,
    age,
    sex,
  ]);

  // ---------------------------------------------------------
  // 1秒ごとに現在時刻を更新
  // ---------------------------------------------------------
  useEffect(() => {
    const id = setInterval(() => setNowSec(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---------------------------------------------------------
  // アルコール減少ロジック
  // ---------------------------------------------------------
  const burnRate = useMemo(() => {
    let v = sex === "male" ? 7.2 : sex === "female" ? 6.8 : 7.0;
    if (age < 30) v += 0.2;
    else if (age >= 60) v -= 0.2;
    return Math.max(3, Math.min(12, Number(v.toFixed(1))));
  }, [sex, age]);

  const decayedA = (t) => {
    const dt_h = Math.max(0, (t - lastTs) / 3600000);
    return Math.max(0, A_g - burnRate * dt_h);
  };

  const A_now = useMemo(() => decayedA(nowSec), [nowSec, lastTs, A_g, burnRate]);

  // ---------------------------------------------------------
  // ドリンク追加
  // ---------------------------------------------------------
  const addDrink = (label, ml, abv) => {
    if (history[0]?.type === "alcohol") {
      alert("次の一杯の前にソフトドリンクを挟んでください");
      return;
    }
    const now = Date.now();
    const grams = ml * (abv / 100) * 0.8;

    setAg((v) => v + grams);
    setLastTs(now);
    setLastAlcoholTs(now);
    setLastDrinkGrams(grams);
    setWaterBonusSec(0);

    setHistory((h) => [
      { id: Math.random().toString(36).slice(2), ts: now, type: "alcohol", label, ml, abv },
      ...h,
    ]);
  };

  // ---------------------------------------------------------
  // ソフトドリンク
  // ---------------------------------------------------------
  const addWater = () => {
    const now = Date.now();
    const mandatory = history[0]?.type === "alcohol";

    setHistory((h) => [
      { id: Math.random().toString(36).slice(2), ts: now, type: "water", label: "ソフトドリンク/水" },
      ...h,
    ]);

    if (!mandatory) {
      setWaterBonusSec((s) => s + 600);
    }

    if (mandatory) {
      setWaterFX(true);
      setTimeout(() => setWaterFX(false), 1200);
    }
  };

  // ---------------------------------------------------------
  // DrinkPicker open/close
  // ---------------------------------------------------------
  const openDrinkPicker = (kind, preset) => {
    if (history[0]?.type === "alcohol") return;
    setPicker({
      open: true,
      ...preset,
      kind,
    });
  };

  const closePicker = () => {
    setPicker((p) => ({ ...p, open: false }));
  };

  const confirmPicker = () => {
    addDrink(`${picker.label} ${picker.ml}ml (${picker.abv}%)`, picker.ml, picker.abv);
    closePicker();
  };

  // ---------------------------------------------------------
  // 終了処理
  // ---------------------------------------------------------
  const endSession = () => {
    const now = Date.now();
    setAg(0);
    setLastTs(now);
    setHistory([]);
    setWaterBonusSec(0);
    setLastAlcoholTs(0);
    setLastDrinkGrams(0);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}

    setGoodNightOpen(true);
  };

  // ---------------------------------------------------------
  // 必須ウォーター判定
  // ---------------------------------------------------------
  const needsWater = history[0]?.type === "alcohol";

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">

      {/* Header */}
      <Header
        isPro={isPro}
        A_now={A_now}
        scoreProps={{ A_g, weightKg, sex }}
        onHelp={() => setIsHelpOpen(true)}
      />

      {/* Main content */}
      <main
        className="w-full max-w-md mx-auto flex-1 px-4 pt-3"
        style={{ paddingBottom: footerHeight + 16 }}
      >
        {tab === "main" && (
          <MainPanel
            nowSec={nowSec}
            lastAlcoholTs={lastAlcoholTs}
            lastDrinkGrams={lastDrinkGrams}
            waterBonusSec={waterBonusSec}
            addWater={addWater}
            openDrinkPicker={openDrinkPicker}
          />
        )}

        {tab === "history" && (
          <HistoryPanel history={history} />
        )}

        {tab === "settings" && (
          <SettingsPanel
            weightKg={weightKg}
            age={age}
            sex={sex}
            setWeightKg={setWeightKg}
            setAge={setAge}
            setSex={setSex}
            endSession={endSession}
          />
        )}

        <div className="text-center text-[10px] text-slate-400 mt-4 px-4 leading-relaxed">
          ※ 本アプリは医療的な診断を行うものではありません。体調に合わせて節度ある飲酒を。
        </div>
      </main>

      {/* Footer */}
      <nav
        ref={footerRef}
        className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur"
      >
        <div className="max-w-md mx-auto px-4">
          <div className="grid grid-cols-3 h-16">
            {["main", "history", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex flex-col items-center justify-center ${
                  tab === t ? "text-slate-900" : "text-slate-400"
                }`}
              >
                <span className="text-[11px] font-medium">
                  {t === "main" ? "メイン" : t === "history" ? "履歴" : "設定"}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-1 text-[10px] text-slate-400 text-center"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 32px)" }}>
            <a href="/about.html" className="hover:underline">使い方</a>
            <span className="mx-1">・</span>
            <a href="/privacy.html" className="hover:underline">プライバシー</a>
            <span className="mx-1">・</span>
            <a href="/disclaimer.html" className="hover:underline">免責事項</a>
          </div>
        </div>
      </nav>

      {/* overlays */}
      <AnimatePresence>
        {needsWater && (
          <WaterGate addWater={addWater} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {waterFX && <WaterFX />}
      </AnimatePresence>

      <AnimatePresence>
        {picker.open && (
          <DrinkPicker
            picker={picker}
            setPicker={setPicker}
            closePicker={closePicker}
            confirmPicker={confirmPicker}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {goodNightOpen && (
          <GoodNightOverlay onClose={() => setGoodNightOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
