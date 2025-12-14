"use client";

import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";

export function TransitionOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <div className="relative">
      <div>{children}</div>

     {/* a overlay top of the page */}
      <motion.div
        key={key}
        className="pointer-events-none fixed inset-0 z-9999 bg-background"
        initial={{ scaleX: 1, transformOrigin: "right" }}
        animate={{ scaleX: 0, transformOrigin: "right" }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />
    </div>
  );
}
