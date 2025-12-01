// src/utils/constants.js

export const PRESETS = {
  beer: {
    sizes: [350, 500],
    abv: 5,
  },
  sake: {
    sizes: [
      { k: "ochoko", label: "お猪口（90ml）", ml: 90 },
      { k: "ichigo", label: "一合（180ml）", ml: 180 },
    ],
    abv: 15,
  },
  chuhai: {
    sizes: [350, 500],
    abvMin: 3,
    abvMax: 9,
  },
  other: {
    mlMin: 50,
    mlMax: 500,
    mlStep: 25,
    abvMin: 1,
    abvMax: 60,
    abvStep: 1,
  },
};

export const COCKTAIL_STRENGTHS = [
  { key: "weak", label: "弱め（5%）", abv: 5, note: "軽いカクテル" },
  { key: "normal", label: "普通（10%）", abv: 10, note: "一般的なカクテル" },
  { key: "strong", label: "強め（20%）", abv: 20, note: "度数高め" },
];
