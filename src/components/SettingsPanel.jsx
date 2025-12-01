// src/components/SettingsPanel.jsx
import React from "react";

export default function SettingsPanel({
  weightKg,
  setWeightKg,
  weightInput,
  setWeightInput,
  age,
  setAge,
  ageInput,
  setAgeInput,
  sex,
  setSex,
  endSession,
}) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm grid gap-4">
      {/* 上段：体重・年齢・性別 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 体重 */}
        <div>
          <div className="text-xs text-slate-500">体重 (kg)</div>
          <input
            className="w-full mt-1 border rounded-xl px-3 h-11"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="kg"
            value={weightInput}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setWeightInput(v);
            }}
            onBlur={() => {
              if (weightInput === "") {
                setWeightInput(String(weightKg));
                return;
              }
              const n = parseInt(weightInput, 10);
              if (Number.isFinite(n) && n >= 30 && n <= 200) {
                setWeightKg(n);
                setWeightInput(String(n));
              } else {
                setWeightInput(String(weightKg));
              }
            }}
          />
        </div>

        {/* 年齢 */}
        <div>
          <div className="text-xs text-slate-500">年齢</div>
          <input
            className="w-full mt-1 border rounded-xl px-3 h-11"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="歳"
            value={ageInput}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setAgeInput(v);
            }}
            onBlur={() => {
              if (ageInput === "") {
                setAgeInput(String(age));
                return;
              }
              const n = parseInt(ageInput, 10);
              if (Number.isFinite(n) && n >= 16 && n <= 99) {
                setAge(n);
                setAgeInput(String(n));
              } else {
                setAgeInput(String(age));
              }
            }}
          />
        </div>

        {/* 性別 */}
        <div className="col-span-2">
          <div className="text-xs text-slate-500 mb-1">性別</div>
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
      </div>

      {/* 下段：終了ボタン */}
      <div className="grid gap-2 mt-2">
        <button
          type="button"
          onClick={endSession}
          className="w-full h-12 px-4 rounded-xl border font-semibold active:scale-[.98]"
        >
          飲み会終了
        </button>
        <div className="text-[10px] text-slate-500">
          すべてのカウント・履歴・タイマーをリセットします
        </div>
      </div>
    </section>
  );
}
