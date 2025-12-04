// src/App.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { saveState, loadState } from "./utils/storage";

import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import HistoryPanel from "./components/HistoryPanel";
import SettingsPanel from "./components/SettingsPanel";

import { PRESETS } from "./utils/constants";
import WaterGate from "./components/WaterGate";
import WaterFX from "./components/WaterFX";
import DrinkPicker from "./components/DrinkPicker.jsx";
import GoodNightOverlay from "./components/GoodNightOverlay";

import { motion, AnimatePresence } from "framer-motion";

// ローカルストレージのキー（以前のコードで使っていたものに合わせる）
const STORAGE_KEY = "nomel_v1";

export default function App() {
  const [tab, setTab] = useState("main");
  const [isPro, setIsPro] = useState(false);

  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const [nowSec, setNowSec] = useState(Date.now());

  const [history, setHistory] = useState([]);
  const [A_g, setAg] = useState(0);
  const [lastTs, setLastTs] = useState(Date.now());
  const [lastAlcoholTs, setLastAlcoholTs] = useState(0);
  const [lastDrinkGrams, setLastDrinkGrams] = useState(0);

  const [weightKg, setWeightKg] = useState(75);
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("male");
  const [weightInput, setWeightInput] = useState(String(weightKg));
const [ageInput, setAgeInput] = useState(String(age));


  const [waterBonusSec, setWaterBonusSec] = useState(0);

  const [waterFX, setWaterFX] = useState(false);
  const [goodNightOpen, setGoodNightOpen] = useState(false);

  const [picker, setPicker] = useState({
    open: false,
    kind: null,
    label: "",
    ml: 350,
    abv: 4,
    sizeKey: null,
    note: "",
  });

  const [pickerJustOpened, setPickerJustOpened] = useState(false);





  // ヘルプ用
  const [helpOpen, setHelpOpen] = useState(false);
  const onOpenHelp = () => setHelpOpen(true);

  const [booted, setBooted] = useState(false);


  // footer 高さ監視
  useEffect(() => {
    if (!footerRef.current) return;
    const el = footerRef.current;

    const update = () => {
      setFooterHeight(el.getBoundingClientRect().height);
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

  // 状態復元
  useEffect(() => {
    const saved = loadState();
    if (!saved) {
      setBooted(true);
      return;
    }

    if (saved.weightKg) setWeightKg(saved.weightKg);
    if (saved.age) setAge(saved.age);
    if (saved.sex) setSex(saved.sex);

    const now = Date.now();
    const last = Number(saved.lastTs ?? now);
    const dt_h = Math.max(0, (now - last) / 3600000);

    let burn = (saved.sex ?? sex) === "male" ? 7.2 : 6.8;
    const ag = saved.age ?? age;
    if (ag < 30) burn += 0.2;
    if (ag >= 60) burn -= 0.2;

    const Ag = Math.max(0, Number(saved.A_g ?? 0) - burn * dt_h);

    setAg(Ag);
    setLastTs(now);
    setHistory(Array.isArray(saved.history) ? saved.history : []);
    setWaterBonusSec(Number(saved.waterBonusSec ?? 0));
    setLastAlcoholTs(Number(saved.lastAlcoholTs ?? 0));
    setLastDrinkGrams(Number(saved.lastDrinkGrams ?? 0));

    setBooted(true);
  }, []);

  // 状態保存
  useEffect(() => {
    if (!booted) return;
    const id = setTimeout(() => {
      saveState({
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

  // タイマー
  useEffect(() => {
    const id = setInterval(() => setNowSec(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // アルコール減少
  const burnRate = useMemo(() => {
    let v = sex === "male" ? 7.2 : 6.8;
    if (age < 30) v += 0.2;
    if (age >= 60) v -= 0.2;
    return Math.max(3, Math.min(12, v));
  }, [sex, age]);

  const A_now = useMemo(() => {
    const dt_h = Math.max(0, (nowSec - lastTs) / 3600000);
    return Math.max(0, A_g - burnRate * dt_h);
  }, [nowSec, lastTs, A_g, burnRate]);

// ② scoreExact（バーの長さ％）
const scoreExact = Math.min(100, A_now * 2);

// ③ stage（色とラベル）
const stage = useMemo(() => {
  const x = A_now;

  if (x < 3) return { label: "シラフ", bar: "bg-emerald-500" };
  if (x < 10) return { label: "ほろ酔い", bar: "bg-lime-500" };
  if (x < 20) return { label: "パーティー", bar: "bg-yellow-500" };
  if (x < 30) return { label: "酔い", bar: "bg-orange-500" };
  if (x < 40) return { label: "ベロベロ", bar: "bg-red-500" };
  return { label: "危険", bar: "bg-red-700" };
}, [A_now]);



  // 次の1杯までの秒数
  const nextOkSec = useMemo(() => {
    const target = 15;
    const need = A_now - target;
    if (need <= 0) return 0;

    const sec = (need / burnRate) * 3600 - waterBonusSec;
    return Math.max(0, Math.floor(sec));
  }, [A_now, burnRate, waterBonusSec]);

  // ドリンク追加
  const addDrink = (label, ml, abv) => {
    const grams = ml * (abv / 100) * 0.8;
    const now = Date.now();

    setAg((v) => v + grams);
    setLastTs(now);
    setLastAlcoholTs(now);
    setLastDrinkGrams(grams);
    setWaterBonusSec(0);

    setHistory((h) => [
      { id: Math.random().toString(36), ts: now, type: "alcohol", label, ml, abv },
      ...h,
    ]);
  };

const openDrinkPicker = (kind) => {

    console.log("=== openDrinkPicker CALLED ===");
  console.log("kind:", kind);

  console.log("PRESETS keys:", Object.keys(PRESETS));
  console.log("PRESETS[kind]:", PRESETS[kind]);

  setPickerJustOpened(true);
setTimeout(() => setPickerJustOpened(false), 0);

    console.log("before modifying history, history[0]:", history[0]);


  // WaterGate を強制的に止める
setHistory((h) => {
  console.log("inside setHistory, h[0] before:", h[0]);

  if (h[0]?.type === "alcohol") {
    const newH = [{ id: "temp", ts: Date.now(), type: "temp" }, ...h];
    console.log("inside setHistory, h[0] after:", newH[0]);
    return newH;
  }
  return h;
});


  const preset = PRESETS[kind];
  if (!preset) return;

  const hasSizes = Array.isArray(preset.sizes);

  console.log("Setting picker.open = true");

  
  setPicker({
    open: true,
    kind,
    label: preset.label ?? "",
    ml: hasSizes ? null : (preset.mlMin ?? 100),

    abv:
      preset.showAbv === false
        ? preset.abv
        : (preset.abv ?? preset.abvMin ?? 5),

    sizeKey: null,
    note: "",
  });
  console.log("picker should now be open");
};





  const closePicker = () => setPicker((p) => ({ ...p, open: false }));

  const confirmPicker = () => {
  if (!picker.ml) return;   // ← 追加：サイズ未選択なら追加できない
  addDrink(`${picker.label} ${picker.ml}ml (${picker.abv}%)`, picker.ml, picker.abv);
  closePicker();
};


  // 飲み会終了（全リセット）
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
    } catch (e) {
      // 取れなくてもアプリは動くので無視
    }

    setGoodNightOpen(true);
  };

  // 水
  const addWater = () => {
    const now = Date.now();
    const mandatory = history[0]?.type === "alcohol";

    setHistory((h) => [
      { id: Math.random().toString(36), ts: now, type: "water", label: "ソフトドリンク/水" },
      ...h,
    ]);

    if (!mandatory) {
      setWaterBonusSec((s) => s + 600);
    } else {
      setWaterFX(true);
      setTimeout(() => setWaterFX(false), 1200);
    }
  };

const needsWater =
  !picker.open &&
  !pickerJustOpened &&
  history[0]?.type === "alcohol";








  // UI
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
<Header
  isPro={isPro}
  A_now={A_now}
  onOpenHelp={onOpenHelp}
  stage={stage}
  scoreExact={scoreExact}
/>

      {console.log("DEBUG",
  "picker.open=", picker.open,
  "needsWater=", needsWater,
  "history[0]?.type=", history[0]?.type
)}



      <main
        className="w-full max-w-md mx-auto flex-1 px-4 pt-3"
        style={{ paddingBottom: footerHeight + 16 }}
      >
        {tab === "main" && (
          <MainPanel
            nowSec={nowSec}
            nextOkSec={nextOkSec}
            waterBonusSec={waterBonusSec}
            addWater={addWater}
            openDrinkPicker={openDrinkPicker}
            addDrink={addDrink}
          />
        )}

        {tab === "history" && <HistoryPanel history={history} />}

{tab === "settings" && (
  <SettingsPanel
    weightKg={weightKg}
    setWeightKg={setWeightKg}
    weightInput={weightInput}
    setWeightInput={setWeightInput}
    age={age}
    setAge={setAge}
    ageInput={ageInput}
    setAgeInput={setAgeInput}
    sex={sex}
    setSex={setSex}
    endSession={endSession}
  />
)}

      </main>

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
        </div>
      </nav>

      {/* 強制水 */}

      {/* DrinkPicker */}
<AnimatePresence>
  {picker.open && (
    <DrinkPicker
      picker={picker}
      setPicker={setPicker}
      PRESETS={PRESETS}
      closePicker={closePicker}
      confirmPicker={confirmPicker}
    />
  )}
</AnimatePresence>


{/* 必ず Picker の下に置く */}
<AnimatePresence>
  {(!picker.open && needsWater) && (
    <WaterGate needsWater={needsWater} addWater={addWater} />
  )}
</AnimatePresence>







      {/* 水エフェクト */}
      <AnimatePresence>
        {waterFX && <WaterFX />}
      </AnimatePresence> 

    

      {/* おやすみオーバーレイ */}
      <AnimatePresence>
        {goodNightOpen && <GoodNightOverlay onClose={() => setGoodNightOpen(false)} />}
      </AnimatePresence>

      {/* Help Overlay */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[80] grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-[90%] max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-bold mb-2 text-lg">使い方</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                飲んだお酒の種類をタップすると、「次の1杯までの休憩時間」が自動計算されます。
                <br />
                <br />
                ソフトドリンクを飲んでボタンを押すと、休憩時間が10分短くなります。
              </p>

              <button
                className="mt-5 w-full h-10 bg-slate-800 text-white rounded-lg"
                onClick={() => setHelpOpen(false)}
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
