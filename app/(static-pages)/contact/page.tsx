"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedBackground from "@/components/ui/AnimatedBackground";


export default function ContactPage() {
  const supportEmail = "prizmaiport@gmail.com";
  const subject = encodeURIComponent("PRizm Support");
  const body = encodeURIComponent(
    "Hi PRizm Support,\n\nRepo (optional):\nPR link (optional):\nIssue:\n\nThanks!"
  );

  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* Animated Grid Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 z-40 w-full bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <Link
              className="text-sm text-white/60 hover:text-white"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-white"
              href="/terms"
            >
              Terms
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="pt-40 pb-32 px-6">
        <div className="mx-auto max-w-3xl space-y-10">

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Contact Support
            </h1>

            <p className="mt-2 text-white/60 text-sm">
              Email support is the fastest way to get help.
            </p>
          </div>

          {/* Email Card */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-3">
              Email
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-sm text-white/70">

              <div>
                <div className="font-medium text-white">
                  {supportEmail}
                </div>
                Include repo + PR link if relevant.
              </div>

              <Button asChild>
                <a
                  href={`mailto:${supportEmail}?subject=${subject}&body=${body}`}
                  className="flex items-center"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email support
                </a>
              </Button>

            </div>
          </GlassCard>

          <p className="text-xs text-white/60">
            If you&apos;re reporting a security issue, email the same address
            and include “SECURITY” in the subject.
          </p>

        </div>
      </section>

    </main>
  );
}
