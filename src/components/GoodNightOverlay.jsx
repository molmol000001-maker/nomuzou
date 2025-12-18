// src/components/GoodNightOverlay.jsx
import React from "react";
import { motion } from "framer-motion";

export default function GoodNightOverlay({ onClose }) {
  return (
    <motion.div
      key="goodnight"
      className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose} // 外側タップで閉じる
    >
      <motion.div
        className="relative w-[88vw] max-w-xs rounded-3xl bg-white/95 shadow-2xl px-6 py-8 text-center select-none"
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 6 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()} // 内側は閉じない
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (["Enter", " ", "Escape"].includes(e.key)) onClose();
        }}
      >
        <motion.div
          className="text-6xl mb-2"
          initial={{ rotate: -8 }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          😴
        </motion.div>

        <div className="text-xl font-bold tracking-tight">おやすみなさい</div>
        <div className="text-[12px] text-slate-500 mt-1">タップで閉じる</div>

        <motion.span
          className="absolute -z-10 inset-0 m-auto h-48 w-48 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(59,130,246,.18), transparent)",
          }}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.7, 0.4, 0.7],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
