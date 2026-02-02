"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnim(selector: string) {
  useEffect(() => {
    gsap.fromTo(
      selector,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: selector,
          start: "top 85%",
        },
      }
    );
  }, [selector]);
}
