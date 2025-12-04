// src/utils/constants.js

  // DrinkPicker プリセット
 export const PRESETS = {
  beer: {
    sizes: [350, 500],
    abv: 4,
    label: "ビール",
    showAbv: false,
  },

  sake: {
    sizes: [
      { k: "ochoko", ml: 50, label: "お猪口 (50ml)" },
      { k: "ichigo", ml: 180, label: "一合 (180ml)" },
    ],
    abv: 15,
    label: "日本酒",
    showAbv: false,
  },

  wine: {
    sizes: [120],     // ← 固定
    abv: 12,          // ← 変更したいなら言って
    label: "ワイン",
    showAbv: false,
  },

  shochu: {
    sizes: [45],      // ← 固定
    abv: 25,          // ← 固定
    label: "焼酎",
  },

  whisky: {
    sizes: [30, 60, 90],
    abv: 40,
    label: "ウイスキー",
    showAbv: false,
  },

  gin: {
    sizes: [30, 60, 90],
    abv: 40,
    label: "ジン",
    showAbv: false,
  },

  rum: {
    sizes: [30, 60, 90],
    abv: 40,
    label: "ラム",
    showAbv: false,
  },

vodka: {
  sizes: [30, 60, 90],
  abv: 40,
  label: "ウォッカ",
  showAbv: false,
},
tequila: {
  sizes: [30, 60, 90],
  abv: 40,
  label: "テキーラ",
  showAbv: false,
},


  chuhai: {
    sizes: [350, 500],
    abvMin: 1,
    abvMax: 9,
    label: "酎ハイ",
  },

  cocktail: {
    mlMin: 50,
    mlMax: 1000,
    mlStep: 50,
    abvMin: 1,
    abvMax: 50,
    label: "カクテル",
  },

  other: {
    mlMin: 50,
    mlMax: 1000,
    mlStep: 50,
    abvMin: 1,
    abvMax: 60,
    label: "その他",
  },
};
