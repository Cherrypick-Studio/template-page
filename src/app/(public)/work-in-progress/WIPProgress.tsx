"use client";

import { useEffect, useState } from "react";

export default function WIPProgress() {
  const targetPercent = 60;
  const [percent, setPercent] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (percent < targetPercent) {
      const timer = setTimeout(() => setPercent((p) => p + 1), 30);
      return () => clearTimeout(timer);
    }
  }, [percent]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#007FFF] flex flex-col justify-center items-center w-30 h-30 rounded-full z-10">
      <span className="text-[24px] text-[#FEFEFE]">{percent}%</span>
      <span className="text-xs text-[#FEFEFE]">Progress{".".repeat(dotCount)}</span>
    </div>
  );
}
