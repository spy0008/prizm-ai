"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedBackground() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    gsap.to(gridRef.current, {
      backgroundPosition: "400% 400%",
      duration: 40,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 -z-50 bg-[linear-gradient(120deg,#05070d,#0b1020,#05070d)] bg-size-[400%_400%]"
    >
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[40px_40px]" />
    </div>
  );
}
