// app/privacy/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";

export const metadata = { title: "Privacy — PRizm" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo/>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/terms">
            Terms
          </Link>
        </div>
      </header>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective date: Dec 13, 2025</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What this covers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                This policy explains what data is collected, why it&apos;s collected, and how to contact support with privacy
                questions.
              </p>
              <p>
                This is a starter template and should be finalized with legal review and based on your actual data flows.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 text-sm leading-relaxed">
            <h2 className="text-base font-semibold">Data collected</h2>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>GitHub identity basics (e.g., user id/username) needed for login.</li>
              <li>Repository metadata you authorize (e.g., repo name, PR identifiers).</li>
              <li>Operational data (logs, error reports) for reliability and security.</li>
            </ul>

            <h2 className="text-base font-semibold">How data is used</h2>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>To provide PR review automation and related features.</li>
              <li>To secure the service, prevent abuse, and debug issues.</li>
              <li>To improve product quality and performance.</li>
            </ul>

            <h2 className="text-base font-semibold">Data retention</h2>
            <p className="text-muted-foreground">
              Retention periods depend on product configuration and legal requirements. Limit retention where possible.
            </p>

            <h2 className="text-base font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Privacy questions:{" "}
              <Link className="underline underline-offset-4" href="mailto:prizmaiport@gmail.com">
                prizmaiport@gmail.com
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
