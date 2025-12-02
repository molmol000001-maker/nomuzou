// src/components/DrinkPicker.jsx
import React from "react";
import { motion } from "framer-motion";

export default function DrinkPicker({
  picker,
  setPicker,
  PRESETS,
  closePicker,
  confirmPicker,
}) {
  const preset = PRESETS[picker.kind];
  if (!preset) return null;

  const isFixedML = Array.isArray(preset.sizes); // 固定量？
  const isFixedABV = preset.abv && !preset.abvMin && !preset.abvMax; // 固定度数？

  const setMl = (v) => setPicker((p) => ({ ...p, ml: Number(v) }));
  const setAbv = (v) => setPicker((p) => ({ ...p, abv: Number(v) }));

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closePicker}
    >
      <motion.div
        className="bg-white rounded-2xl p-5 w-full max-w-xs"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold mb-4 text-lg">{preset.label}</div>

        {/* ======== 量（ml） ======== */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-1">量（ml）</div>

          {/* 固定量（サイズが数値 or オブジェクト） */}
          {isFixedML && (
            <div className="grid grid-cols-3 gap-2">
              {preset.sizes.map((item) => {
                const ml = typeof item === "number" ? item : item.ml;
                const label =
                  typeof item === "number" ? `${item} ml` : item.label;

                return (
                  <button
                    key={label}
                    onClick={() => setMl(ml)}
                    className={`h-10 rounded-lg border ${
                      picker.ml === ml
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* 可変量スライダー */}
          {!isFixedML && (
            <>
              <input
                type="range"
                min={preset.mlMin ?? 1}
                max={preset.mlMax ?? 1000}
                step={preset.mlStep ?? 1}
                value={picker.ml}
                onChange={(e) => setMl(e.target.value)}
                className="w-full"
              />
              <div className="text-right text-sm">{picker.ml} ml</div>
            </>
          )}
        </div>

        {/* ======== 度数（%） ======== */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-1">度数（%）</div>

          {/* 固定度数 */}
          {isFixedABV && (
            <div className="text-right text-sm">{preset.abv}%</div>
          )}

          {/* 可変度数スライダー */}
          {!isFixedABV && (
            <>
              <input
                type="range"
                min={preset.abvMin ?? preset.abv}
                max={preset.abvMax ?? preset.abv}
                step={1}
                value={picker.abv}
                onChange={(e) => setAbv(e.target.value)}
                className="w-full"
              />
              <div className="text-right text-sm">{picker.abv}%</div>
            </>
          )}
        </div>

        <button
          onClick={confirmPicker}
          className="w-full h-10 rounded-xl bg-slate-900 text-white font-semibold mt-2"
        >
          追加する
        </button>
      </motion.div>
    </motion.div>
  );
}
