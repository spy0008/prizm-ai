import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";

export const metadata = { title: "Terms — Prizmai" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo/>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/contact">
            Support
          </Link>
        </div>
      </header>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Terms of Service</h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective date: Dec 13, 2025</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plain-language overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                These Terms govern access to Prizmai and related services. Use of the service means agreement to these Terms.
              </p>
              <p>
                This page is a starter template and should be reviewed by qualified legal counsel before production use.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 text-sm leading-relaxed">
            <h2 className="text-base font-semibold">Use of the service</h2>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>You must have rights to connect repositories you authorize.</li>
              <li>You are responsible for activity performed via your account.</li>
              <li>You must not use the service for unlawful or abusive activities.</li>
            </ul>

            <h2 className="text-base font-semibold">Accounts and access</h2>
            <p className="text-muted-foreground">
              Login is provided via GitHub. Access may be suspended for security, abuse prevention, or policy violations.
            </p>

            <h2 className="text-base font-semibold">IP and feedback</h2>
            <p className="text-muted-foreground">
              You retain ownership of your code. PRizm may use feedback you provide to improve the product.
            </p>

            <h2 className="text-base font-semibold">Disclaimers</h2>
            <p className="text-muted-foreground">
              The service is provided “as is”. AI output may be incorrect; review suggestions before merging.
            </p>

            <h2 className="text-base font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, email{" "}
              <Link className="underline underline-offset-4" href="mailto:support@prizm.com">
                support@prizm.com
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
