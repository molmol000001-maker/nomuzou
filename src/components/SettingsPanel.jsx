// src/components/SettingsPanel.jsx
import React from "react";

export default function SettingsPanel({
  weightKg,
  setWeightKg,
  age,
  setAge,
  sex,
  setSex,
  endSession,
}) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm grid gap-4">

      {/* 体重 */}
      <div className="grid gap-1">
        <div className="text-xs text-slate-500">体重 (kg)</div>
        <input
          type="number"
          className="w-full border rounded-xl px-3 h-11"
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
        />
      </div>

      {/* 年齢 */}
      <div className="grid gap-1">
        <div className="text-xs text-slate-500">年齢</div>
        <input
          type="number"
          className="w-full border rounded-xl px-3 h-11"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>

      {/* 性別 */}
      <div className="grid gap-1">
        <div className="text-xs text-slate-500">性別</div>
        <div className="flex gap-2">
          {[
            { id: "male", label: "男性" },
            { id: "female", label: "女性" },
            { id: "other", label: "その他" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSex(opt.id)}
              className={`h-11 px-3 rounded-xl text-sm font-semibold border active:scale-[.98] ${
                sex === opt.id ? "bg-slate-900 text-white" : "bg-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 飲み会終了 */}
      <div className="grid gap-2 mt-3">
        <button
          onClick={endSession}
          className="w-full h-12 px-4 rounded-xl border font-semibold active:scale-[.98]"
        >
          飲み会終了
        </button>
        <div className="text-[10px] text-slate-500 text-center">
          タイマーと履歴をすべてリセットします
        </div>
      </div>
    </section>
  );
}
