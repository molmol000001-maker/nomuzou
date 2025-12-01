// src/components/Header.jsx
import React from "react";

export default function Header({ isPro, A_now, onOpenHelp }) {
  return (
    <header className="bg-white/70 border-b border-slate-200 w-full">
      <div className="text-[10px] text-slate-500">Pro: {isPro ? "有効" : "無効"}</div>

      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-start gap-3">
        {/* 左 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">飲酒管理 nomuzou</div>

            <button
              type="button"
              onClick={onOpenHelp}
              className="flex items-center justify-center rounded-full border border-slate-300 w-6 h-6 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
              aria-label="nomuzou の使い方を見る"
            >
              ?
            </button>
          </div>

          <p className="mt-1 text-[11px] text-slate-600 leading-snug">
            🍺 飲んだお酒のボタンをタップすると、次の1杯までの休憩タイマーが動きます。
          </p>
        </div>

        {/* 右 */}
        <div className="text-right w-32">
          <div className="text-[10px] text-slate-500">酔い度</div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-slate-500"
              style={{ width: `${Math.min(A_now * 10, 100)}%` }}
            />
          </div>

          <div className="mt-1 text-[10px] text-slate-500">
            体内アルコール残量目安: {A_now.toFixed(2)} g
          </div>
        </div>
      </div>
    </header>
  );
}
