"use client";

import { TransitionOverlay } from "@/components/transition-overlay";

export default function TemplateSwip({ children }: { children: React.ReactNode }) {
  return <TransitionOverlay>{children}</TransitionOverlay>;
}
