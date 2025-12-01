// src/components/HistoryPanel.jsx
import React from "react";

export default function HistoryPanel({ history, fmtTime }) {
  const totalAlcoholG = history
    .filter((h) => h.type === "alcohol")
    .reduce((sum, h) => sum + h.ml * (h.abv / 100) * 0.8, 0);

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm">
      {history.length === 0 ? (
        <div className="text-slate-500">まだ履歴はありません。</div>
      ) : (
        <>
          {/* 総アルコール量 */}
          <div className="mb-3 p-3 rounded-xl bg-slate-100 text-sm font-medium text-slate-700">
            総アルコール量: {totalAlcoholG.toFixed(1)}g
          </div>

          {/* 履歴リスト */}
          <div className="grid gap-3">
            {history.map((h) => (
              <div key={h.id} className="border rounded-xl p-3">
                <div className="text-[11px] text-slate-500">{fmtTime(h.ts)}</div>
                <div className="font-medium text-sm">{h.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
