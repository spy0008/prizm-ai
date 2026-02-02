"use client";

import Link from "next/link";

import Logo from "@/components/logo";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 z-40 w-full bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

          <Logo />

          <Link
            className="text-sm text-white/60 hover:text-white"
            href="/terms"
          >
            Terms
          </Link>

        </div>
      </header>

      {/* Content */}
      <section className="pt-40 pb-32 px-6">

        <div className="mx-auto max-w-3xl space-y-10">

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Privacy Policy
            </h1>

            <p className="mt-2 text-white/60 text-sm">
              Effective date: Dec 13, 2025
            </p>
          </div>

          {/* Overview */}
          <GlassCard>

            <h2 className="text-lg font-semibold mb-3">
              Plain-Language Overview
            </h2>

            <div className="space-y-3 text-sm text-white/70 leading-relaxed">

              <p>
                This policy explains what data is collected, why it&apos;s
                collected, and how it is used.
              </p>

              <p>
                This is a starter template and should be reviewed by
                legal counsel before production use.
              </p>

            </div>

          </GlassCard>

          {/* Sections */}
          <div className="space-y-8 text-sm leading-relaxed">

            {/* Data */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Data Collected
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>GitHub username and profile data</li>
                <li>Repository and PR metadata</li>
                <li>System logs and error reports</li>
              </ul>
            </div>

            {/* Usage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                How We Use Data
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>To provide automation services</li>
                <li>To improve security</li>
                <li>To enhance performance</li>
              </ul>
            </div>

            {/* Retention */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Data Retention
              </h2>

              <p className="text-white/70">
                Data is retained only as long as necessary
                for service operation.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Contact
              </h2>

              <p className="text-white/70">
                Privacy questions:{" "}
                <Link
                  href="mailto:prizmaiport@gmail.com"
                  className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                >
                  prizmaiport@gmail.com
                </Link>
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
