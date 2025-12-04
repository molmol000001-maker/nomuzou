import React from "react";
import { motion } from "framer-motion";
import { PRESETS } from "../utils/constants";   // ← これが絶対必要！！！

export default function DrinkPicker({
  picker,
  setPicker,
  closePicker,
  confirmPicker,
}) {
  const preset = PRESETS[picker.kind];
  if (!preset) return null;

  const isFixedABV = preset.abv !== undefined && !preset.abvMin && !preset.abvMax;

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

        {/* --- 量（ml） --- */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">量（ml）</div>

          {Array.isArray(preset.sizes) ? (
            <div className="grid grid-cols-2 gap-2">
              {preset.sizes.map((item) => {
                const ml = typeof item === "number" ? item : item.ml;
                const label = typeof item === "number" ? `${item} ml` : item.label;
                return (
                  <button
                    key={label}
                    onClick={() => setPicker((p) => ({ ...p, ml }))}
                    className={`h-12 rounded-xl border text-sm flex flex-col justify-center items-center ${
                      picker.ml === ml
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
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

        {/* --- 度数（%） --- */}
        {preset.showAbv !== false && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">度数（%）</div>

            {isFixedABV ? (
              <div className="text-right text-sm font-medium">{preset.abv}%</div>
            ) : (
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
        )}

        <button
          onClick={confirmPicker}
          disabled={!picker.ml}
          className={`w-full h-12 rounded-xl font-semibold mt-2 ${
            picker.ml ? "bg-slate-900 text-white" : "bg-slate-300 text-slate-500"
          }`}
        >
          追加する
        </button>
      </motion.div>
    </motion.div>
  );
}
