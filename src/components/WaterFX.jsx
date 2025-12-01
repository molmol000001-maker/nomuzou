// src/components/WaterFX.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaterFX({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="waterfx"
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-64 h-64 grid place-items-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* 中央の水しぶき */}
            <motion.div
              className="h-28 w-28 rounded-full bg-sky-500 shadow-2xl grid place-items-center text-white"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
            >
              <span className="text-5xl">💧</span>
            </motion.div>

            {/* 波紋1 */}
            <motion.span
              className="absolute h-36 w-36 rounded-full"
              style={{ background: "rgba(59,130,246,0.25)" }}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 0.1 }}
            />

            {/* 波紋2 */}
            <motion.span
              className="absolute h-44 w-44 rounded-full"
              style={{ background: "rgba(59,130,246,0.18)" }}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                repeatDelay: 0.1,
                delay: 0.15,
              }}
            />

            {/* コンフェッティ */}
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-white/90"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 130,
                  y: Math.sin((i / 12) * Math.PI * 2) * 130,
                  opacity: 0,
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            ))}

            {/* テキスト */}
            <motion.div
              className="absolute bottom-4 text-white font-semibold drop-shadow"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
            >
              いいチョイス！
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
