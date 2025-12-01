// src/components/DrinkPicker.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COCKTAIL_STRENGTHS } from "../utils/constants";


export default function DrinkPicker({
  picker,
  setPicker,
  PRESETS,
  COCKTAIL_STRENGTHS,
  closePicker,
  confirmPicker,
}) {
  return (
    <AnimatePresence>
      {picker.open && (
        <motion.div
          key="picker"
          className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm grid place-items-end sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePicker}
        >
          <motion.div
            className="w-full sm:w-[420px] rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-lg">{picker.label}</div>

            {/* beer */}
            {picker.kind === "beer" && (
              <div className="mt-3 grid gap-3">
                <div className="text-xs text-slate-500">量（ml）</div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.beer.sizes.map((v) => (
                    <button
                      key={v}
                      onClick={() => setPicker((p) => ({ ...p, ml: v }))}
                      className={`h-10 px-3 rounded-xl border font-semibold ${
                        picker.ml === v ? "bg-slate-900 text-white" : "bg-white"
                      }`}
                    >
                      {v}ml
                    </button>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  選択: {picker.ml}ml（度数 {picker.abv}%）
                </div>
              </div>
            )}

            {/* sake */}
            {picker.kind === "sake" && (
              <div className="mt-3 grid gap-3">
                <div className="text-xs text-slate-500">量（お猪口 / 一合）</div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.sake.sizes.map((s) => (
                    <button
                      key={s.k}
                      onClick={() =>
                        setPicker((p) => ({
                          ...p,
                          sizeKey: s.k,
                          ml: s.ml,
                          note: s.label,
                        }))
                      }
                      className={`h-10 px-3 rounded-xl border font-semibold ${
                        picker.sizeKey === s.k
                          ? "bg-slate-900 text-white"
                          : "bg-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  選択: {picker.note}（度数 {picker.abv}%）
                </div>
              </div>
            )}

            {/* cocktail */}
            {picker.kind === "cocktail" && (
              <div className="mt-3 grid gap-3">
                <div className="text-xs text-slate-500">強さ</div>
                <div className="flex flex-wrap gap-2">
                  {COCKTAIL_STRENGTHS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() =>
                        setPicker((p) => ({
                          ...p,
                          sizeKey: s.key,
                          abv: s.abv,
                          note: s.note,
                        }))
                      }
                      className={`h-10 px-3 rounded-xl border font-semibold ${
                        picker.sizeKey === s.key
                          ? "bg-slate-900 text-white"
                          : "bg-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-slate-600">{picker.note}</div>

                <div className="text-xs text-slate-500">量（ml）</div>
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="25"
                  value={picker.ml}
                  onChange={(e) =>
                    setPicker((p) => ({
                      ...p,
                      ml: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="text-sm text-slate-600">
                  選択: {picker.ml}ml（度数 {picker.abv}%）
                </div>
              </div>
            )}

            {/* chuhai */}
            {picker.kind === "chuhai" && (
              <div className="mt-3 grid gap-4">
                <div>
                  <div className="text-xs text-slate-500">量（ml）</div>
                  <div className="flex gap-2">
                    {PRESETS.chuhai.sizes.map((v) => (
                      <button
                        key={v}
                        onClick={() =>
                          setPicker((p) => ({
                            ...p,
                            ml: v,
                          }))
                        }
                        className={`h-10 px-3 rounded-xl border font-semibold ${
                          picker.ml === v
                            ? "bg-slate-900 text-white"
                            : "bg-white"
                        }`}
                      >
                        {v}ml
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">度数（1〜9%）</div>
                  <input
                    type="range"
                    min={PRESETS.chuhai.abvMin}
                    max={PRESETS.chuhai.abvMax}
                    step="1"
                    value={picker.abv}
                    onChange={(e) =>
                      setPicker((p) => ({
                        ...p,
                        abv: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600">
                    選択: {picker.abv}%
                  </div>
                </div>
              </div>
            )}

            {/* other */}
            {picker.kind === "other" && (
              <div className="mt-3 grid gap-4">
                <div>
                  <div className="text-xs text-slate-500">量（ml）</div>
                  <input
                    type="range"
                    min={PRESETS.other.mlMin}
                    max={PRESETS.other.mlMax}
                    step={PRESETS.other.mlStep}
                    value={picker.ml}
                    onChange={(e) =>
                      setPicker((p) => ({
                        ...p,
                        ml: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600">
                    選択: {picker.ml}ml
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">度数（%）</div>
                  <input
                    type="range"
                    min={PRESETS.other.abvMin}
                    max={PRESETS.other.abvMax}
                    step={PRESETS.other.abvStep}
                    value={picker.abv}
                    onChange={(e) =>
                      setPicker((p) => ({
                        ...p,
                        abv: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600">
                    選択: {picker.abv}%
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  例: 250ml / 7%（缶サワー・自作カクテルなど）
                </div>
              </div>
            )}

            {/* ボタン */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={closePicker}
                className="h-11 rounded-xl border font-semibold active:scale-[.98]"
              >
                キャンセル
              </button>
              <button
                onClick={confirmPicker}
                className="h-11 rounded-xl bg-slate-900 text-white font-semibold active:scale-[.98]"
              >
                追加
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
