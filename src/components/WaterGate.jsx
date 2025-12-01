// src/components/WaterGate.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaterGate({ needsWater, addWater }) {
  if (!needsWater) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="gate"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-xs p-6 text-center shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-sm text-slate-600 mb-4">
            一杯お酒を飲んだので、次の前にソフトドリンクを挟みましょう。
          </div>

          {/* 波紋エフェクト */}
          <div className="relative mx-auto grid place-items-center">
            <motion.span
              className="absolute h-24 w-24 rounded-full"
              style={{ background: "rgba(59,130,246,0.15)" }}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 0.4 }}
            />
            <motion.span
              className="absolute h-24 w-24 rounded-full"
              style={{ background: "rgba(59,130,246,0.10)" }}
              initial={{ scale: 1.0, opacity: 0.5 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.4,
                delay: 0.15,
              }}
            />

            {/* 中央の💧 */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 5 }}
              onClick={addWater}
              className="relative h-24 w-24 rounded-full bg-slate-900 text-white font-bold shadow-lg grid place-items-center"
            >
              <span className="text-2xl">💧</span>
            </motion.button>
          </div>

          <div className="mt-3 text-xs text-slate-500">ソフトドリンク</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
