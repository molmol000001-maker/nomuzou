// src/hooks/useFooterHeight.js
import { useEffect, useRef, useState } from "react";

/**
 * フッターの高さを常に監視し、
 * safe-area を含めた正しい paddingBottom を返す hook
 */
export function useFooterHeight() {
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;

    const el = footerRef.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setFooterHeight(rect.height);
    };

    update(); // 初回測定

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { footerRef, footerHeight };
}
