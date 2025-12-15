import { Button } from "@/components/ui/button";
import Link from "next/link";
import CodeCard from "@/components/homeComponents/codeCard";
import { requireUnAuth } from "@/module/auth/utils/auth-utils";
import { features, faqs, howtouse } from "@/constant/home-page-var";
import { Container } from "@/components/homeComponents/Container";
import { Pill } from "@/components/homeComponents/pill";
import Logo from "@/components/logo";

export default async function Home() {
  await requireUnAuth();
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b  bg-background/80 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
           <Logo/>

            <nav className="hidden items-center gap-6 text-sm text-foreground/70 md:flex">
              <Link className="hover:text-foreground/90" href="#features">
                Features
              </Link>
              <Link className="hover:text-foreground/90" href="#how">
                How it works
              </Link>
              <Link className="hover:text-foreground/90" href="#faq">
                FAQ
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href={"/login"}>
                <Button className="cursor-pointer">Get started</Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="border-b border-foreground/20">
        <Container>
          <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
            {/* Left */}
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Pill>AI PR code reviewer</Pill>
                <Pill>GitHub-native workflow</Pill>
                <Pill>Built for teams</Pill>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Ship faster with PR reviews that don&apos;t bottleneck your
                team.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
                Prizmai summarizes changes, flags risky code, and leaves
                actionable review comments so developers stay in flow and
                businesses ship with confidence.
              </p>

              <div className="mt-6 flex flex-wrap gap-3" id="get-started">
                <Link href={"/login"}>
                  <Button className="cursor-pointer">Get started</Button>
                </Link>
                <Link href={"#features"}>
                  <Button className="cursor-pointer" variant="secondary">
                    See features
                  </Button>
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-foreground/60">
                <div className="rounded-xl border border-foreground/20 bg-background p-3">
                  <div className="text-sm font-bold text-foreground/90">Minutes</div>
                  Review turnaround
                </div>
                <div className="rounded-xl border border-foreground/20 bg-background p-3">
                  <div className="text-sm font-bold text-foreground/90">
                    Less noise
                  </div>
                  Higher signal comments
                </div>
                <div className="rounded-xl border border-foreground/20 bg-background p-3">
                  <div className="text-sm font-bold text-foreground/90">
                    No context switch
                  </div>
                  PR-native feedback
                </div>
              </div>
            </div>

            {/* Right */}
            <div id="sample" className="md:pl-8">
              <CodeCard />
              <p className="mt-3 text-xs text-foreground/50">
                Demo content only. Replace with real screenshots once the bot is
                live.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-foreground/20">
        <Container>
          <div className="py-14 md:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Reviews that are clear, specific, and merge-oriented.
              </h2>
              <p className="mt-3 text-foreground/70">
                Designed for developers and businesses that want predictable
                quality without slowing delivery.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl hover:shadow-2xl border border-foreground/20 bg-background p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold">{f.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-foreground/20">
        <Container>
          <div className="py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {howtouse.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl hover:shadow-2xl border border-foreground/20 bg-background p-5 shadow-sm"
                >
                  <div className="text-xs font-semibold text-foreground/50">
                    {s.step}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{s.title}</div>
                  <p className="mt-2 text-sm text-foreground/70">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 hover:shadow-2xl rounded-2xl border border-foreground/20 bg-foreground/5 p-6">
              <div className="text-sm font-semibold">Tip</div>
              <p className="mt-2 text-sm text-foreground/70">
                If you plan to publish on GitHub Marketplace later, you&apos;ll
                likely need basics like a clear description and a privacy
                policy/support link good to plan early.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-foreground/20">
        <Container>
          <div className="py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              FAQ
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl hover:shadow-2xl border border-foreground/20 bg-background p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold">{f.q}</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="rounded-3xl hover:shadow-2xl border border-foreground/20 bg-foreground/5 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                  Turn PR reviews into a speed advantage.
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  Start with one repo. Expand when the team trusts the signal.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={"/login"}>
                  <Button className="cursor-pointer">Get started</Button>
                </Link>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-col gap-3 border-t border-foreground/20 pt-6 text-xs text-foreground/60 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} Prizmai. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link className="hover:text-foreground/90" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-foreground/90" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground/90" href="/security">
                Security
              </Link>
            </div>
          </footer>
        </Container>
      </section>
    </main>
  );
}
