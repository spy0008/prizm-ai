"use client";

import Link from "next/link";

import Logo from "@/components/logo";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function TermsPage() {
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
            href="/contact"
          >
            Support
          </Link>

        </div>
      </header>

      {/* Content */}
      <section className="pt-40 pb-32 px-6">

        <div className="mx-auto max-w-3xl space-y-10">

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Terms of Service
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
                These Terms govern access to PRizm and related services. Using
                this platform means you agree to these Terms.
              </p>

              <p>
                This page is a starter template and should be reviewed by
                qualified legal counsel before production use.
              </p>

            </div>

          </GlassCard>

          {/* Sections */}
          <div className="space-y-8 text-sm leading-relaxed">

            {/* Usage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Use of the Service
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  You must have rights to connect authorized repositories.
                </li>

                <li>
                  You are responsible for all activity under your account.
                </li>

                <li>
                  Unlawful or abusive usage is prohibited.
                </li>
              </ul>
            </div>

            {/* Access */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Accounts and Access
              </h2>

              <p className="text-white/70">
                Authentication is provided via GitHub. Access may be suspended
                for security, abuse prevention, or policy violations.
              </p>
            </div>

            {/* IP */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Intellectual Property & Feedback
              </h2>

              <p className="text-white/70">
                You retain ownership of your code. Feedback may be used to
                improve PRizm.
              </p>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Disclaimers
              </h2>

              <p className="text-white/70">
                The service is provided “as is”. AI-generated suggestions may be
                inaccurate and must be reviewed before merging.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Contact
              </h2>

              <p className="text-white/70">
                Questions about these Terms:{" "}
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
