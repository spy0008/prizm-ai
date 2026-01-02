"use client";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";

export const metadata = { title: "Login — PRizma" };

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Logo/>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/#features">Features</Link>
            </Button>
          </div>
        </div>
      </header>

  
      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Use GitHub to continue. No passwords, no extra accounts.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Continue with GitHub</CardTitle>
              <CardDescription>
                Connect your GitHub account to manage repos and PR review
                settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button disabled={isLoading} onClick={handleGithubLogin} className="w-full cursor-pointer" asChild>
                <span >
                  <Github className="mr-2 h-4 w-4" />
                { isLoading ? "Signing..." : "Sign in with GitHub"}
                </span>
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-xs text-muted-foreground">
                    Secure OAuth sign-in
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to the{" "}
                <Link className="underline underline-offset-4" href="/terms">
                  Terms
                </Link>{" "}
                and{" "}
                <Link className="underline underline-offset-4" href="/privacy">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Trouble signing in?{" "}
            <Link className="underline underline-offset-4" href="/contact">
              Contact support
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginUI;
