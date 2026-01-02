import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";

export const metadata = { title: "Contact Support — PRizm" };

export default function ContactPage() {
  const supportEmail = "support@PRizm.com";
  const subject = encodeURIComponent("PRizm Support");
  const body = encodeURIComponent(
    "Hi PRizm Support,\n\nRepo (optional):\nPR link (optional):\nIssue:\n\nThanks!"
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/terms"
            >
              Terms
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Contact support
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Email support is the fastest way to get help.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">
                  {supportEmail}
                </div>
                Include repo + PR link if relevant.
              </div>

              <Button asChild>
                <a
                  href={`mailto:${supportEmail}?subject=${subject}&body=${body}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email support
                </a>
              </Button>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            If you&apos;re reporting a security issue, email the same address
            and include “SECURITY” in the subject.
          </p>
        </div>
      </section>
    </main>
  );
}
