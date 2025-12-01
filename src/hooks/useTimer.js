// src/hooks/useTimer.js
import { useState, useEffect } from "react";

export function useTimer() {
  const [nowSec, setNowSec] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNowSec(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return nowSec;
}
