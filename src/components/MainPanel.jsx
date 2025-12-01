// src/components/MainPanel.jsx
import React from "react";
import { motion } from "framer-motion";

export default function MainPanel({
  nextOkSec,
  nowSec,
  waterBonusSec,
  addWater,
  openDrinkPicker,
  addDrink,
  setGoodNightOpen,
}) {
  // 表示用フォーマット
  const fmtMMSS = (s) => {
    const m = Math.floor(s / 60);
    const ss = String(Math.floor(s % 60)).padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm grid gap-4">
      {/* タイマー行 */}
      <div className="flex items-center justify-between">
        {/* 左ブロック */}
        <div>
          <div className="text-2xl font-bold tracking-tight">
            {fmtMMSS(nextOkSec)}
          </div>

          {nextOkSec > 0 && (
            <div className="text-[11px] text-slate-500">
              （{new Date(nowSec + nextOkSec * 1000).toTimeString().slice(0, 5)} 目安）
            </div>
          )}

          {waterBonusSec > 0 && (
            <div className="text-[11px] text-slate-500">
              ソフトドリンク効果: -{Math.floor(waterBonusSec / 60)}分
            </div>
          )}
        </div>

        {/* ソフトドリンクボタン */}
        <button
          onClick={addWater}
          className="h-11 px-4 rounded-xl bg-slate-100 font-semibold active:scale-[.98]"
        >
          ソフトドリンク
        </button>
      </div>

      {/* 飲み物ボタン群 */}
      <div className="grid grid-cols-2 gap-2">
        {/* ビール */}
        <button
          onClick={() => openDrinkPicker("beer")}
          className="h-12 px-4 rounded-xl font-semibold bg-yellow-600 text-white"
        >
          ビール
        </button>

        {/* 酎ハイ */}
        <button
          onClick={() => openDrinkPicker("chuhai")}
          className="h-12 px-4 rounded-xl font-semibold bg-cyan-600 text-white"
        >
          酎ハイ
        </button>

        {/* ウイスキー */}
        <button
          onClick={() => addDrink("ウイスキー 40ml (40%)", 40, 40)}
          className="h-12 px-4 rounded-xl font-semibold bg-orange-700 text-white"
        >
          ウイスキー
        </button>

        {/* 焼酎 */}
        <button
          onClick={() => addDrink("焼酎 90ml (25%)", 90, 25)}
          className="h-12 px-4 rounded-xl font-semibold bg-rose-600 text-white"
        >
          焼酎
        </button>

        {/* 日本酒 */}
        <button
          onClick={() => openDrinkPicker("sake")}
          className="h-12 px-4 rounded-xl font-semibold bg-emerald-600 text-white"
        >
          日本酒
        </button>

        {/* カクテル */}
        <button
          onClick={() => openDrinkPicker("cocktail")}
          className="h-12 px-4 rounded-xl font-semibold bg-pink-500 text-white"
        >
          カクテル
        </button>

        {/* ジン */}
        <button
          onClick={() => addDrink("ジン 30ml (40%)", 30, 40)}
          className="h-12 px-4 rounded-xl font-semibold bg-indigo-600 text-white"
        >
          ジン
        </button>

        {/* ウォッカ */}
        <button
          onClick={() => addDrink("ウォッカ 30ml (40%)", 30, 40)}
          className="h-12 px-4 rounded-xl font-semibold bg-blue-700 text-white"
        >
          ウォッカ
        </button>

        {/* ラム */}
        <button
          onClick={() => addDrink("ラム 30ml (40%)", 30, 40)}
          className="h-12 px-4 rounded-xl font-semibold bg-amber-700 text-white"
        >
          ラム
        </button>

        {/* ワイン */}
        <button
          onClick={() => addDrink("ワイン 100ml (12%)", 100, 12)}
          className="h-12 px-4 rounded-xl font-semibold bg-purple-600 text-white"
        >
          ワイン
        </button>

        {/* テキーラ */}
        <button
          onClick={() => addDrink("テキーラ 30ml (40%)", 30, 40)}
          className="h-12 px-4 rounded-xl font-semibold bg-lime-700 text-white"
        >
          テキーラ
        </button>

        {/* その他 */}
        <button
          onClick={() => openDrinkPicker("other")}
          className="h-12 px-4 rounded-xl font-semibold bg-slate-500 text-white"
        >
          その他
        </button>
      </div>
    </section>
  );
}
