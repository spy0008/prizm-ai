"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import GlassCard from "@/components/ui/GlassCard";

import { useScrollAnim } from "@/lib/useScrollAnim";

import {
  features,
  faqs,
  howtouse,
} from "@/constant/home-page-var";

import Logo from "@/components/logo";

export default function Home() {
  useScrollAnim(".reveal");

  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

          <Logo />

          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <Link href="#features">Features</Link>
            <Link href="#how">Workflow</Link>
            <Link href="#faq">FAQ</Link>
          </nav>

          <Link href="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-40 pb-32 relative">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-6 reveal">

            <p className="text-green-400 font-mono text-sm">
              &gt; AI PR Review System
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Code Reviews.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
                Automated.
              </span>
            </h1>

            <p className="text-white/70 max-w-xl">
              PRizm analyzes your pull requests, detects risks,
              and delivers production ready feedback
              directly inside GitHub.
            </p>

            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg">Start Free</Button>
              </Link>

              <Link href="#features">
                <Button size="lg" variant="secondary">
                  Explore
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Terminal */}
          <div className="reveal">

            <div className="rounded-xl bg-black/80 border border-white/10 p-5 font-mono text-sm text-green-400 shadow-xl">

              <p>$ prizm analyze ./pull-request</p>
              <p className="mt-2 text-white/60">
                → scanning files...
              </p>

              <p className="mt-2 text-cyan-400">
                ✔ Security issue detected
              </p>

              <p className="text-purple-400">
                ✔ Performance optimized
              </p>

              <p className="mt-2 text-green-400">
                ✓ Ready to merge
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-3xl md:text-4xl font-bold mb-12 reveal">
            Built for Serious Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {features.map((f) => (
              <div key={f.title} className="reveal">
                <GlassCard>

                  <h3 className="font-semibold mb-2">
                    {f.title}
                  </h3>

                  <p className="text-white/60 text-sm">
                    {f.desc}
                  </p>

                </GlassCard>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-32 bg-white/2">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-3xl md:text-4xl font-bold mb-12 reveal">
            Workflow
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {howtouse.map((s) => (
              <div key={s.step} className="reveal">
                <GlassCard>

                  <p className="text-xs text-cyan-400 font-mono">
                    {s.step}
                  </p>

                  <h3 className="mt-2 font-semibold">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/60">
                    {s.desc}
                  </p>

                </GlassCard>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-3xl md:text-4xl font-bold mb-12 reveal">
            FAQ
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {faqs.map((f) => (
              <div key={f.q} className="reveal">
                <GlassCard>

                  <h3 className="font-semibold">
                    {f.q}
                  </h3>

                  <p className="mt-2 text-sm text-white/60">
                    {f.a}
                  </p>

                </GlassCard>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-3xl bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 p-10 reveal">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div>
                <h3 className="text-2xl font-bold">
                  Ready to ship faster?
                </h3>

                <p className="text-white/60 mt-2">
                  Start reviewing smarter today.
                </p>
              </div>

              <Link href="/login">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/50">

          <p>© {new Date().getFullYear()} PRizm</p>

          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/security">Security</Link>
          </div>

        </div>

      </footer>

    </main>
  );
}
