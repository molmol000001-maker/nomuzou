// src/App.jsx
import React, { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import MainPanel from "./components/MainPanel";
import HistoryPanel from "./components/HistoryPanel";
import SettingsPanel from "./components/SettingsPanel";

import { PRESETS } from "./utils/constants";
import WaterGate from "./components/WaterGate";
import WaterFX from "./components/WaterFX";
import DrinkPicker from "./components/DrinkPicker";
import GoodNightOverlay from "./components/GoodNightOverlay";

import { motion, AnimatePresence } from "framer-motion";

import useAlcoholState from "./hooks/useAlcoholState";
import { useTimer } from "./hooks/useTimer";

export default function App() {
  const [tab, setTab] = useState("main");
  const [isPro, setIsPro] = useState(false);

  // footer高さ
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // now (Date.now ms)
  const nowMs = useTimer();

  // alcohol engine
  const alcohol = useAlcoholState(nowMs);

  // Settingsの入力欄（文字列として保持）
  const [weightInput, setWeightInput] = useState("75");
  const [ageInput, setAgeInput] = useState("35");

  // alcohol側の値がロードされたら入力欄へ反映
  useEffect(() => {
    if (typeof alcohol.weightKg === "number") setWeightInput(String(alcohol.weightKg));
  }, [alcohol.weightKg]);

  useEffect(() => {
    if (typeof alcohol.age === "number") setAgeInput(String(alcohol.age));
  }, [alcohol.age]);

  // 演出系
  const [waterFX, setWaterFX] = useState(false);
  const [goodNightOpen, setGoodNightOpen] = useState(false);

  // picker
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

  // ヘルプ
  const [helpOpen, setHelpOpen] = useState(false);
  const onOpenHelp = () => setHelpOpen(true);

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

  // ドリンク追加（実処理は hook）
  const closePicker = () => setPicker((p) => ({ ...p, open: false }));

  const confirmPicker = () => {
    if (!picker.ml) return; // サイズ未選択対策
    alcohol.addDrink(
      `${picker.label} ${picker.ml}ml (${picker.abv}%)`,
      picker.ml,
      picker.abv
    );
    closePicker();
  };

  // WaterGate対策の openDrinkPicker（あなたの現行ロジックを温存）
  const openDrinkPicker = (kind) => {
    setPickerJustOpened(true);
    setTimeout(() => setPickerJustOpened(false), 0);

    // WaterGate を強制的に止める（history先頭がalcoholなら temp を挿入）
    alcohol.setHistory((h) => {
      if (h[0]?.type === "alcohol") {
        return [{ id: "temp", ts: Date.now(), type: "temp" }, ...h];
      }
      return h;
    });

    const preset = PRESETS[kind];
    if (!preset) return;

    const hasSizes = Array.isArray(preset.sizes);

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
  };

  // 水（mandatory判定はApp側、加算はhook側）
  const addWater = () => {
    const mandatory = alcohol.history[0]?.type === "alcohol";

    alcohol.addWater(!!mandatory);

    if (mandatory) {
      setWaterFX(true);
      setTimeout(() => setWaterFX(false), 1200);
    }
  };

  // 飲み会終了
  const endSession = () => {
    alcohol.endSession();
    setGoodNightOpen(true);
  };

  const needsWater =
    !picker.open &&
    !pickerJustOpened &&
    alcohol.history[0]?.type === "alcohol";

  // UI
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      <Header
        isPro={isPro}
        A_now={alcohol.A_now}
        onOpenHelp={onOpenHelp}
        stage={alcohol.stage}
        scoreExact={alcohol.scoreExact}
      />

      <main
        className="w-full max-w-md mx-auto flex-1 px-4 pt-3"
        style={{ paddingBottom: footerHeight + 16 }}
      >
        {tab === "main" && (
          <MainPanel
            nowSec={nowMs}
            nextOkSec={alcohol.nextOkSec}
            waterBonusSec={alcohol.waterBonusSec}
            addWater={addWater}
            openDrinkPicker={openDrinkPicker}
            addDrink={alcohol.addDrink}
          />
        )}

        {tab === "history" && <HistoryPanel history={alcohol.history} />}

        {tab === "settings" && (
          <SettingsPanel
            weightKg={alcohol.weightKg}
            setWeightKg={(v) => alcohol.setUser({ weightKg: v })}
            weightInput={weightInput}
            setWeightInput={setWeightInput}
            age={alcohol.age}
            setAge={(v) => alcohol.setUser({ age: v })}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
            sex={alcohol.sex}
            setSex={(v) => alcohol.setUser({ sex: v })}
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

      {/* DrinkPicker */}
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

      {/* 必ず Picker の下に置く */}
      <AnimatePresence>
        {!picker.open && needsWater && (
          <WaterGate needsWater={needsWater} addWater={addWater} />
        )}
      </AnimatePresence>

      {/* 水エフェクト */}
      <AnimatePresence>{waterFX && <WaterFX />}</AnimatePresence>

      {/* おやすみオーバーレイ */}
      <AnimatePresence>
        {goodNightOpen && (
          <GoodNightOverlay onClose={() => setGoodNightOpen(false)} />
        )}
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
