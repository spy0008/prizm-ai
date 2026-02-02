"use client";

import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";

export function TransitionOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden">

      {/* Page */}
      <div>{children}</div>

      {/* Transition Layer */}
      <motion.div
        key={key}
        className="pointer-events-none fixed inset-0 z-9999 overflow-hidden"
        initial="enter"
        animate="exit"
        variants={{
          enter: { opacity: 1 },
          exit: { opacity: 0 },
        }}
      >
        {/* Main Overlay */}
        <motion.div
          className="
            absolute inset-0
            bg-linear-to-r
            from-[#05070d]
            via-[#0b1020]
            to-[#05070d]
          "
          initial={{ scaleX: 1, transformOrigin: "right" }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Grid Layer */}
        <motion.div
          className="
            absolute inset-0
            opacity-[0.06]
            bg-[linear-gradient(to_right,white_1px,transparent_1px),
                linear-gradient(to_bottom,white_1px,transparent_1px)]
            bg-size-[40px_40px]
          "
          initial={{ opacity: 0.15 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Scan Line */}
        <motion.div
          className="
            absolute top-0 left-0 w-full h-0.5
            bg-linear-to-r
            from-transparent
            via-cyan-400
            to-transparent
            shadow-[0_0_20px_#22d3ee]
          "
          initial={{ y: "0%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />

        {/* Glow Pulse */}
        <motion.div
          className="
            absolute inset-0
            bg-cyan-400/5
            blur-3xl
          "
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
}
