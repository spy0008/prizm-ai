"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

import GlassCard from "@/components/ui/GlassCard";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export const metadata = {
  title: "Login — PRizm",
};

export default function LoginUI() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 z-40 w-full bg-black/40 backdrop-blur-xl border-b border-white/10">

        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

          <Logo />

          <div className="flex items-center gap-3 text-sm">

            <Link
              href="/"
              className="text-white/60 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/#features"
              className="text-white/60 hover:text-white"
            >
              Features
            </Link>

          </div>
        </div>
      </header>

      {/* Content */}
      <section className="pt-40 pb-32 px-6">

        <div className="mx-auto max-w-md space-y-8">

          {/* Title */}
          <div className="text-center space-y-2">

            <p className="text-green-400 font-mono text-xs">
              &gt; Authentication Gateway
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              Sign In to PRizm
            </h1>

            <p className="text-white/60 text-sm">
              Secure GitHub OAuth. No passwords stored.
            </p>

          </div>

          {/* Login Card */}
          <GlassCard>

            <div className="space-y-6">

              {/* Info */}
              <div className="space-y-1">

                <h2 className="font-semibold">
                  Continue with GitHub
                </h2>

                <p className="text-sm text-white/60">
                  Connect your repositories and enable AI PR reviews.
                </p>

              </div>

              {/* Button */}
              <Button
                disabled={isLoading}
                onClick={handleGithubLogin}
                size="lg"
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />

                {isLoading ? "Authorizing..." : "Sign in with GitHub"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-white/40">

                <span className="flex-1 h-px bg-white/10" />
                Secure OAuth
                <span className="flex-1 h-px bg-white/10" />

              </div>

              {/* Terms */}
              <p className="text-xs text-white/50 text-center leading-relaxed">

                By continuing, you agree to our{" "}

                <Link
                  href="/terms"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  Terms
                </Link>{" "}
                and{" "}

                <Link
                  href="/privacy"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .

              </p>

            </div>

          </GlassCard>

          {/* Help */}
          <p className="text-xs text-center text-white/50">

            Trouble signing in?{" "}

            <Link
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              Contact support
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}
